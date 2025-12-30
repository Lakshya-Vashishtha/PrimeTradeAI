import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import {
    Plus, Trash2, Edit2, LogOut, CheckCircle2, User as UserIcon,
    LayoutDashboard, Settings, Bell, Search, Filter, MoreVertical,
    Clock, Hash
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Dashboard = () => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newTask, setNewTask] = useState({ title: '', description: '' });
    const [editingId, setEditingId] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const { logout } = useAuth();

    const fetchTasks = async () => {
        try {
            const response = await api.get('/tasks/');
            setTasks(response.data);
        } catch (err) {
            console.error('Failed to fetch tasks');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    const handleCreate = async (e) => {
        e.preventDefault();
        if (!newTask.title.trim()) return;
        try {
            if (editingId) {
                await api.put(`/tasks/${editingId}`, newTask);
            } else {
                await api.post('/tasks/', newTask);
            }
            setNewTask({ title: '', description: '' });
            setEditingId(null);
            fetchTasks();
        } catch (err) {
            alert('Action failed');
        }
    };

    const handleDelete = async (id) => {
        try {
            await api.delete(`/tasks/${id}`);
            fetchTasks();
        } catch (err) {
            alert('Only admins can delete tasks');
        }
    };

    const startEdit = (task) => {
        setNewTask({ title: task.title, description: task.description });
        setEditingId(task.id);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const filteredTasks = tasks.filter(task =>
        task.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="flex min-h-screen bg-surface">
            {/* Sleek Sidebar */}
            <aside className="hidden lg:flex flex-col w-72 bg-white border-r border-gray-100 p-6">
                <div className="flex items-center gap-3 mb-10 px-2">
                    <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center text-white font-bold text-xl">
                        T
                    </div>
                    <span className="text-xl font-bold tracking-tight">TaskFlow</span>
                </div>

                <nav className="flex-1 space-y-1">
                    <NavItem icon={<LayoutDashboard size={20} />} label="Dashboard" active />
                    <NavItem icon={<Bell size={20} />} label="Notifications" />
                    <NavItem icon={<UserIcon size={20} />} label="My Profile" />
                    <NavItem icon={<Settings size={20} />} label="App Settings" />
                </nav>

                <div className="pt-6 border-t border-gray-100">
                    <button
                        onClick={logout}
                        className="flex items-center gap-3 w-full px-4 py-3 text-gray-500 hover:text-rose-600 hover:bg-rose-50 rounded-2xl transition-all group font-medium"
                    >
                        <LogOut size={20} className="group-hover:rotate-12 transition-transform" />
                        <span>Log out</span>
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col h-screen overflow-hidden">
                {/* Modern Header */}
                <header className="bg-white/80 backdrop-blur-md border-b border-gray-100 px-8 py-4 flex items-center justify-between z-10">
                    <div className="flex items-center gap-4 bg-gray-50 px-4 py-2 rounded-2xl border border-gray-100 w-full max-w-md">
                        <Search size={18} className="text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search your tasks..."
                            className="bg-transparent border-none focus:ring-0 text-sm w-full"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <div className="flex items-center gap-4">
                        <button className="lg:hidden p-2 text-gray-400" onClick={logout}><LogOut size={20} /></button>
                        <div className="w-10 h-10 bg-indigo-50 border border-indigo-100 rounded-full flex items-center justify-center text-indigo-600">
                            <UserIcon size={20} />
                        </div>
                    </div>
                </header>

                {/* Scrollable Canvas */}
                <div className="flex-1 overflow-y-auto p-8 bg-[#fafafa]">
                    <div className="max-w-6xl mx-auto">
                        <div className="mb-10">
                            <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight">Your Canvas</h2>
                            <p className="text-gray-500 mt-2 text-lg">Focus on what matters today.</p>
                        </div>

                        {/* Floating Quick Add */}
                        <motion.form
                            layout
                            onSubmit={handleCreate}
                            className="bg-white p-8 rounded-[2rem] shadow-[0_15px_40px_rgba(0,0,0,0.03)] border border-gray-100 mb-12"
                        >
                            <div className="flex flex-col md:flex-row gap-4">
                                <div className="flex-1 space-y-4">
                                    <input
                                        type="text"
                                        placeholder="What needs to be done?"
                                        className="w-full bg-transparent text-2xl font-bold placeholder:text-gray-200 focus:outline-none"
                                        value={newTask.title}
                                        onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                                        required
                                    />
                                    <textarea
                                        placeholder="Add some details..."
                                        className="w-full bg-transparent text-gray-500 focus:outline-none resize-none"
                                        rows="1"
                                        value={newTask.description}
                                        onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                                    />
                                </div>
                                <div className="flex items-end">
                                    <button
                                        type="submit"
                                        className="flex items-center justify-center gap-2 px-8 py-4 bg-primary-600 text-white rounded-2xl hover:bg-primary-700 transition-all shadow-xl shadow-primary-200 active:scale-95 font-bold"
                                    >
                                        {editingId ? <Edit2 size={18} /> : <Plus size={18} />}
                                        <span>{editingId ? 'Update' : 'Create'}</span>
                                    </button>
                                </div>
                            </div>
                        </motion.form>

                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-2 text-sm font-bold text-gray-400 uppercase tracking-widest">
                                <Hash size={14} />
                                <span>Active Tasks ({filteredTasks.length})</span>
                            </div>
                            <button className="flex items-center gap-2 text-sm text-gray-500 hover:text-primary-600 transition-colors">
                                <Filter size={14} /> Sort & Filter
                            </button>
                        </div>

                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-20 opacity-20">
                                <div className="animate-pulse w-full max-w-md space-y-4">
                                    <div className="h-20 bg-gray-200 rounded-3xl" />
                                    <div className="h-20 bg-gray-200 rounded-3xl" />
                                </div>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-20">
                                <AnimatePresence mode="popLayout">
                                    {filteredTasks.length > 0 ? filteredTasks.map((task) => (
                                        <motion.div
                                            key={task.id}
                                            layout
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, scale: 0.95 }}
                                            whileHover={{ y: -5 }}
                                            className="bg-white p-7 rounded-[2rem] shadow-sm border border-gray-50 group transition-all"
                                        >
                                            <div className="flex justify-between items-start mb-4">
                                                <div className="p-3 bg-primary-50 rounded-2xl text-primary-600">
                                                    <CheckCircle2 size={24} />
                                                </div>
                                                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button
                                                        onClick={() => startEdit(task)}
                                                        className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all"
                                                    >
                                                        <Edit2 size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(task.id)}
                                                        className="p-2 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </div>

                                            <h3 className="text-xl font-bold text-gray-900 mb-2 leading-snug">{task.title}</h3>
                                            <p className="text-gray-500 text-sm mb-6 line-clamp-2 leading-relaxed">{task.description || "No description provided."}</p>

                                            <div className="flex items-center justify-between pt-5 border-t border-gray-50">
                                                <div className="flex items-center gap-2 text-xs font-semibold text-gray-400">
                                                    <Clock size={14} />
                                                    <span>{new Date(task.created_at).toLocaleDateString()}</span>
                                                </div>
                                                <div className="flex items-center gap-1 text-[10px] font-bold text-primary-400 bg-primary-50/50 px-2 py-1 rounded-full uppercase tracking-tighter">
                                                    <UserIcon size={10} />
                                                    ID: {task.owner_id}
                                                </div>
                                            </div>
                                        </motion.div>
                                    )) : (
                                        <div className="col-span-full py-20 text-center border-2 border-dashed border-gray-100 rounded-[3rem]">
                                            <p className="text-gray-400 font-medium text-lg">No tasks found matching your search.</p>
                                            <button onClick={() => setSearchQuery('')} className="text-primary-600 font-bold mt-2">Clear search</button>
                                        </div>
                                    )}
                                </AnimatePresence>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

const NavItem = ({ icon, label, active = false }) => (
    <button className={`
    flex items-center gap-4 w-full px-4 py-4 rounded-2xl transition-all font-semibold
    ${active
            ? 'bg-primary-600 text-white shadow-lg shadow-primary-200'
            : 'text-gray-500 hover:bg-primary-50 hover:text-primary-600'}
  `}>
        {icon}
        <span>{label}</span>
    </button>
);

export default Dashboard;
