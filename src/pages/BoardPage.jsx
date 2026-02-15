import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useBoard } from '../context/BoardContext';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Plus, Search, Filter, Calendar, Tag, Trash2, MoreVertical, LogOut, Clock, AlertCircle, Edit2 } from 'lucide-react';
import { format } from 'date-fns';
import clsx from 'clsx';
import { useForm } from 'react-hook-form';

/* --- Components --- */

// Task Card Component
const TaskCard = ({ task, index, columnId, onEdit }) => {
    const { deleteTask } = useBoard();

    const priorityColors = {
        low: 'bg-green-500/10 text-green-500 border-green-500/20',
        medium: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
        high: 'bg-red-500/10 text-red-500 border-red-500/20',
    };

    return (
        <Draggable draggableId={task.id} index={index}>
            {(provided, snapshot) => (
                <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className={clsx(
                        "bg-white dark:bg-zinc-800 p-4 rounded-xl shadow-sm border border-zinc-200 dark:border-zinc-700 mb-3 group hover:shadow-md transition-all",
                        snapshot.isDragging ? "shadow-lg rotate-2 scale-105 z-50 ring-2 ring-blue-500/50" : ""
                    )}
                >
                    <div className="flex justify-between items-start mb-2">
                        <span className={clsx("text-xs font-semibold px-2 py-1 rounded-md border", priorityColors[task.priority])}>
                            {task.priority.toUpperCase()}
                        </span>
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity flex space-x-1">
                            <button
                                onClick={() => onEdit(task)}
                                className="p-1 text-zinc-400 hover:text-blue-500 rounded bg-transparent hover:bg-zinc-100 dark:hover:bg-zinc-700"
                            >
                                <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => deleteTask(task.id, columnId)}
                                className="p-1 text-zinc-400 hover:text-red-500 rounded bg-transparent hover:bg-zinc-100 dark:hover:bg-zinc-700"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                    <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-1">{task.title}</h3>
                    {task.description && (
                        <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-3 line-clamp-2">
                            {task.description}
                        </p>
                    )}
                    <div className="flex items-center justify-between text-xs text-zinc-400 mt-2 pt-2 border-t border-zinc-100 dark:border-zinc-700/50">
                        <div className="flex items-center space-x-2">
                            {task.dueDate && (
                                <span className={clsx("flex items-center", new Date(task.dueDate) < new Date() ? "text-red-400" : "")}>
                                    <Calendar className="w-3 h-3 mr-1" />
                                    {format(new Date(task.dueDate), 'MMM d')}
                                </span>
                            )}
                        </div>
                        {task.tags && task.tags.length > 0 && (
                            <div className="flex items-center">
                                <Tag className="w-3 h-3 mr-1" />
                                {task.tags.length}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </Draggable>
    );
};

// Task Modal Component (Create & Edit)
const TaskModal = ({ isOpen, onClose, columnId, taskToEdit }) => {
    const { register, handleSubmit, reset, setValue } = useForm();
    const { addTask, updateTask } = useBoard();

    // Populate form when taskToEdit changes
    useEffect(() => {
        if (taskToEdit) {
            setValue('title', taskToEdit.title);
            setValue('description', taskToEdit.description);
            setValue('priority', taskToEdit.priority);
            setValue('dueDate', taskToEdit.dueDate);
            setValue('tags', taskToEdit.tags ? taskToEdit.tags.join(', ') : '');
        } else {
            reset();
            setValue('priority', 'low'); // Default
        }
    }, [taskToEdit, setValue, reset, isOpen]);

    const onSubmit = (data) => {
        const taskData = {
            title: data.title,
            description: data.description,
            priority: data.priority,
            dueDate: data.dueDate,
            tags: data.tags ? data.tags.split(',').map(t => t.trim()).filter(Boolean) : []
        };

        if (taskToEdit) {
            updateTask(taskToEdit.id, taskData);
        } else {
            addTask(taskData, columnId || 'todo');
        }
        reset();
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-zinc-900 w-full max-w-md rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-700 overflow-hidden">
                <div className="p-6 border-b border-zinc-200 dark:border-zinc-700">
                    <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
                        {taskToEdit ? 'Edit Task' : 'Create New Task'}
                    </h2>
                </div>
                <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Title *</label>
                        <input {...register('title', { required: true })} className="w-full bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Task title" autoFocus />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Description</label>
                        <textarea {...register('description')} className="w-full bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none" rows="3" placeholder="Description details..." />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Priority</label>
                            <select {...register('priority')} className="w-full bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 rounded-lg p-2.5 outline-none">
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Due Date</label>
                            <input type="date" {...register('dueDate')} className="w-full bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 rounded-lg p-2.5 outline-none" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Tags (comma separated)</label>
                        <input {...register('tags')} className="w-full bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 rounded-lg p-2.5 outline-none" placeholder="Design, Dev, Urgent..." />
                    </div>

                    <div className="flex justify-end space-x-3 mt-6">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200">Cancel</button>
                        <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 shadow-lg shadow-blue-600/20">
                            {taskToEdit ? 'Save Changes' : 'Create Task'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// Main Board Page Component
export const BoardPage = () => {
    const { user, logout } = useAuth();
    const { boardData, moveTask, resetBoard } = useBoard();
    const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
    const [editingTask, setEditingTask] = useState(null); // Track task being edited
    const [searchQuery, setSearchQuery] = useState('');
    const [priorityFilter, setPriorityFilter] = useState('all');
    const [sortByDate, setSortByDate] = useState(false);

    // Activity Log Drawer State (simplified as a side panel)
    const [showActivityLog, setShowActivityLog] = useState(false);

    const onDragEnd = (result) => {
        moveTask(result);
    };

    const handleEditTask = (task) => {
        setEditingTask(task);
        setIsTaskModalOpen(true);
    };

    const handleCreateTask = () => {
        setEditingTask(null);
        setIsTaskModalOpen(true);
    };

    const filterAndSortTasks = (taskIds) => {
        if (!taskIds) return [];
        let tasks = taskIds.map(id => boardData.tasks[id]).filter(task => { // Add safety check
            if (!task) return false; // Filter out undefined tasks (e.g. if state is desynced)
            const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter;
            return matchesSearch && matchesPriority;
        });

        if (sortByDate) {
            tasks.sort((a, b) => {
                if (!a.dueDate) return 1;
                if (!b.dueDate) return -1;
                return new Date(a.dueDate) - new Date(b.dueDate);
            });
        }

        return tasks;
    };


    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 flex flex-col">
            {/* Header */}
            <header className="bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 px-6 py-4 flex items-center justify-between sticky top-0 z-40">
                <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/20">
                        <span className="text-white font-bold text-xl">H</span>
                    </div>
                    <h1 className="text-xl font-bold tracking-tight">Task Board</h1>
                </div>

                <div className="flex items-center space-x-4">
                    <div className="hidden md:flex items-center bg-zinc-100 dark:bg-zinc-800 rounded-lg p-1">
                        <input
                            type="text"
                            placeholder="Search tasks..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="bg-transparent border-none focus:ring-0 text-sm px-3 py-1.5 w-64 outline-none"
                        />
                        <Search className="w-4 h-4 text-zinc-400 mr-2" />
                    </div>

                    <button onClick={() => setShowActivityLog(!showActivityLog)} className="p-2 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg relative">
                        <Clock className="w-5 h-5" />
                        {boardData.activityLog.length > 0 && <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>}
                    </button>

                    <div className="text-zinc-300 dark:text-zinc-700">|</div>

                    <div className="flex items-center space-x-3">
                        <div className="text-right hidden sm:block">
                            <p className="text-sm font-medium">{user?.name || 'User'}</p>
                            <p className="text-xs text-zinc-500">{user?.role || 'Guest'}</p>
                        </div>
                        <button onClick={logout} className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors" title="Logout">
                            <LogOut className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 overflow-x-auto overflow-y-hidden p-6 relative">
                {/* Filters Bar */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-3">
                        <button onClick={() => setSortByDate(!sortByDate)} className={clsx("flex items-center space-x-2 px-3 py-1.5 rounded-lg border text-sm font-medium transition-colors", sortByDate ? "bg-blue-50 border-blue-200 text-blue-600" : "bg-white border-zinc-200 text-zinc-600 hover:bg-zinc-50")}>
                            <Calendar className="w-4 h-4" />
                            <span>Sort Due Date</span>
                        </button>

                        <div className="relative group">
                            <button className="flex items-center space-x-2 px-3 py-1.5 rounded-lg border border-zinc-200 bg-white text-zinc-600 text-sm font-medium hover:bg-zinc-50">
                                <Filter className="w-4 h-4" />
                                <span>{priorityFilter === 'all' ? 'All Priorities' : priorityFilter.charAt(0).toUpperCase() + priorityFilter.slice(1)}</span>
                            </button>
                            {/* Simple Dropdown for Priority */}
                            <div className="absolute top-full left-0 mt-2 w-40 bg-white dark:bg-zinc-800 rounded-lg shadow-xl border border-zinc-200 dark:border-zinc-700 hidden group-focus-within:block group-hover:block z-50">
                                {['all', 'high', 'medium', 'low'].map(p => (
                                    <button
                                        key={p}
                                        onClick={() => setPriorityFilter(p)}
                                        className="block w-full text-left px-4 py-2 text-sm hover:bg-zinc-50 dark:hover:bg-zinc-700 first:rounded-t-lg last:rounded-b-lg"
                                    >
                                        {p.charAt(0).toUpperCase() + p.slice(1)}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center space-x-3">
                        <button onClick={resetBoard} className="text-sm text-red-500 hover:text-red-700 font-medium px-3 py-1.5">Reset Board</button>
                        <button onClick={handleCreateTask} className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium shadow-lg shadow-blue-600/20 transition-all active:scale-95">
                            <Plus className="w-5 h-5" />
                            <span>New Task</span>
                        </button>
                    </div>
                </div>

                {/* Kanban Board */}
                <DragDropContext onDragEnd={onDragEnd}>
                    <div className="flex h-full space-x-6 pb-4">
                        {boardData.columnOrder.map((columnId) => {
                            const column = boardData.columns[columnId];
                            const tasks = filterAndSortTasks(column.taskIds);

                            return (
                                <div key={column.id} className="flex-shrink-0 w-80 flex flex-col h-full bg-zinc-100/50 dark:bg-zinc-900/50 rounded-xl border border-zinc-200/60 dark:border-zinc-800">
                                    <div className="p-4 flex items-center justify-between">
                                        <div className="flex items-center space-x-2">
                                            <h2 className="font-bold text-zinc-700 dark:text-zinc-200">{column.title}</h2>
                                            <span className="text-xs font-semibold text-zinc-500 bg-zinc-200 dark:bg-zinc-800 px-2 py-0.5 rounded-full">{tasks.length}</span>
                                        </div>
                                    </div>

                                    <Droppable droppableId={column.id}>
                                        {(provided, snapshot) => (
                                            <div
                                                {...provided.droppableProps}
                                                ref={provided.innerRef}
                                                className={clsx(
                                                    "flex-1 p-3 overflow-y-auto min-h-[100px] transition-colors rounded-b-xl",
                                                    snapshot.isDraggingOver ? "bg-blue-50/50 dark:bg-blue-900/10" : ""
                                                )}
                                            >
                                                {tasks.map((task, index) => (
                                                    <TaskCard key={task.id} task={task} index={index} columnId={column.id} onEdit={handleEditTask} />
                                                ))}
                                                {provided.placeholder}

                                                {tasks.length === 0 && (
                                                    <div className="h-32 flex flex-col items-center justify-center text-zinc-400 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-lg">
                                                        <p className="text-sm">No tasks here</p>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </Droppable>
                                </div>
                            );
                        })}
                    </div>
                </DragDropContext>
            </main>

            {/* Activity Log Panel */}
            {showActivityLog && (
                <div className="fixed inset-y-0 right-0 w-80 bg-white dark:bg-zinc-900 shadow-2xl border-l border-zinc-200 dark:border-zinc-800 z-50 transform transition-transform">
                    <div className="p-5 border-b border-zinc-200 dark:border-zinc-700 flex items-center justify-between">
                        <h3 className="font-bold text-lg">Activity Log</h3>
                        <button onClick={() => setShowActivityLog(false)} className="text-zinc-400 hover:text-zinc-600">×</button>
                    </div>
                    <div className="p-5 overflow-y-auto h-[calc(100vh-70px)] space-y-4">
                        {boardData.activityLog.map((log) => (
                            <div key={log.id} className="text-sm border-l-2 border-blue-500 pl-3 py-1">
                                <p className="text-zinc-800 dark:text-zinc-200">
                                    <span className="font-medium text-blue-600 capitalize">{log.type}</span> task "{log.taskTitle}"
                                </p>
                                {log.type === 'moved' && (
                                    <p className="text-zinc-500 text-xs mt-1">From {log.from} → {log.to}</p>
                                )}
                                <p className="text-zinc-400 text-xs mt-1">{format(new Date(log.timestamp), 'PP p')}</p>
                            </div>
                        ))}
                        {boardData.activityLog.length === 0 && (
                            <p className="text-zinc-400 text-center italic mt-10">No recent activity</p>
                        )}
                    </div>
                </div>
            )}

            <TaskModal
                isOpen={isTaskModalOpen}
                onClose={() => {
                    setIsTaskModalOpen(false);
                    setEditingTask(null); // Clear editing task when modal closes
                }}
                taskToEdit={editingTask}
            />
        </div>
    );
};
