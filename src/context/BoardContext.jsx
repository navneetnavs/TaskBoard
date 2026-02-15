import { createContext, useContext, useEffect, useReducer } from 'react';
import { generateId } from '../utils/utils';

const BoardContext = createContext();

export const useBoard = () => useContext(BoardContext);

const initialState = {
    columns: {
        'todo': { id: 'todo', title: 'To Do', taskIds: [] },
        'doing': { id: 'doing', title: 'Doing', taskIds: [] },
        'done': { id: 'done', title: 'Done', taskIds: [] },
    },
    tasks: {},
    columnOrder: ['todo', 'doing', 'done'],
    activityLog: []
};

// Initial Activity Log Seed
// const seedData = ... (Can add later if needed)

const boardReducer = (state, action) => {
    switch (action.type) {
        case 'SET_BOARD':
            return action.payload;
        case 'ADD_TASK': {
            const { task, columnId } = action.payload;
            const newTask = {
                id: generateId(),
                createdAt: new Date().toISOString(),
                ...task,
            };
            const newTasks = { ...state.tasks, [newTask.id]: newTask };
            const newColumn = {
                ...state.columns[columnId],
                taskIds: [...state.columns[columnId].taskIds, newTask.id],
            };
            const newActivity = {
                id: generateId(),
                type: 'created',
                taskId: newTask.id,
                taskTitle: newTask.title,
                timestamp: new Date().toISOString(),
            };
            return {
                ...state,
                tasks: newTasks,
                columns: { ...state.columns, [columnId]: newColumn },
                activityLog: [newActivity, ...state.activityLog],
            };
        }
        case 'DELETE_TASK': {
            const { taskId, columnId } = action.payload;
            const taskTitle = state.tasks[taskId]?.title || 'Unknown Task';

            const newTasks = { ...state.tasks };
            delete newTasks[taskId];

            const newColumn = {
                ...state.columns[columnId],
                taskIds: state.columns[columnId].taskIds.filter(id => id !== taskId),
            };

            const newActivity = {
                id: generateId(),
                type: 'deleted',
                taskId: taskId,
                taskTitle: taskTitle,
                timestamp: new Date().toISOString(),
            };

            return {
                ...state,
                tasks: newTasks,
                columns: { ...state.columns, [columnId]: newColumn },
                activityLog: [newActivity, ...state.activityLog],
            };

        }
        case 'UPDATE_TASK': {
            const { taskId, updates } = action.payload;
            const oldTask = state.tasks[taskId];
            const newTasks = {
                ...state.tasks,
                [taskId]: { ...oldTask, ...updates }
            };

            const newActivity = {
                id: generateId(),
                type: 'updated',
                taskId: taskId,
                taskTitle: newTasks[taskId].title,
                changes: Object.keys(updates),
                timestamp: new Date().toISOString(),
            };

            return {
                ...state,
                tasks: newTasks,
                activityLog: [newActivity, ...state.activityLog],
            };
        }
        case 'MOVE_TASK': {
            const { source, destination, draggableId } = action.payload;
            const start = state.columns[source.droppableId];
            const finish = state.columns[destination.droppableId];

            if (start === finish) {
                const newTaskIds = Array.from(start.taskIds);
                newTaskIds.splice(source.index, 1);
                newTaskIds.splice(destination.index, 0, draggableId);

                const newColumn = { ...start, taskIds: newTaskIds };
                return {
                    ...state,
                    columns: { ...state.columns, [newColumn.id]: newColumn },
                };
            } else {
                const startTaskIds = Array.from(start.taskIds);
                startTaskIds.splice(source.index, 1);
                const newStart = { ...start, taskIds: startTaskIds };

                const finishTaskIds = Array.from(finish.taskIds);
                finishTaskIds.splice(destination.index, 0, draggableId);
                const newFinish = { ...finish, taskIds: finishTaskIds };

                const taskTitle = state.tasks[draggableId]?.title;
                const newActivity = {
                    id: generateId(),
                    type: 'moved',
                    taskId: draggableId,
                    taskTitle: taskTitle,
                    from: start.title,
                    to: finish.title,
                    timestamp: new Date().toISOString(),
                };

                return {
                    ...state,
                    columns: { ...state.columns, [newStart.id]: newStart, [newFinish.id]: newFinish },
                    activityLog: [newActivity, ...state.activityLog],
                };
            }
        }
        case 'RESET_BOARD':
            return initialState;
        default:
            return state;
    }
};

export const BoardProvider = ({ children }) => {
    // Load initial state from local storage or use default
    const [state, dispatch] = useReducer(boardReducer, initialState, (defaultState) => {
        const persisted = localStorage.getItem('task-board-state');
        return persisted ? JSON.parse(persisted) : defaultState;
    });

    useEffect(() => {
        localStorage.setItem('task-board-state', JSON.stringify(state));
    }, [state]);

    const addTask = (task, columnId = 'todo') => {
        dispatch({ type: 'ADD_TASK', payload: { task, columnId } });
    };

    const deleteTask = (taskId, columnId) => {
        dispatch({ type: 'DELETE_TASK', payload: { taskId, columnId } });
    };

    const updateTask = (taskId, updates) => {
        dispatch({ type: 'UPDATE_TASK', payload: { taskId, updates } });
    };

    const moveTask = (result) => {
        const { destination, source, draggableId } = result;

        if (!destination) return;
        if (
            destination.droppableId === source.droppableId &&
            destination.index === source.index
        ) return;

        dispatch({ type: 'MOVE_TASK', payload: { source, destination, draggableId } });
    };

    const resetBoard = () => {
        if (window.confirm("Are you sure you want to reset the board? This cannot be undone.")) {
            dispatch({ type: 'RESET_BOARD' });
        }
    };

    return (
        <BoardContext.Provider value={{
            boardData: state,
            addTask,
            deleteTask,
            updateTask,
            moveTask,
            resetBoard
        }}>
            {children}
        </BoardContext.Provider>
    );
};
