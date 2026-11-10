import React, { useState, useEffect } from 'react';
import mentorService from '../../services/mentorService';
import { useAuth } from '../../contexts/AuthContext';

const TaskManagement = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    dueDate: '',
    assignedTo: [],
  });
  const [assignedStudents, setAssignedStudents] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user?.id) {
      fetchTasks();
      fetchAssignedStudents();
    }
  }, [user?.id]);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await mentorService.getMyTasks();
      setTasks(response.data || []);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAssignedStudents = async () => {
    try {
      const response = await mentorService.getMyStudents();
      setAssignedStudents(response.data || []);
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!user?.id) return;
    try {
      setLoading(true);
      await mentorService.createTask(user.id, newTask);
      setNewTask({ title: '', description: '', dueDate: '', assignedTo: [] });
      fetchTasks();
    } catch (error) {
      console.error('Error creating task:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateTaskStatus = async (taskId, status) => {
    try {
      setLoading(true);
      await mentorService.updateTask(taskId, { status });
      fetchTasks();
    } catch (error) {
      console.error('Error updating task:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Create Task Form */}
      <div className="card card-pad">
        <div className="md:grid md:grid-cols-3 md:gap-6">
          <div className="md:col-span-1">
            <h3 className="section-title">Create New Task</h3>
            <p className="muted mt-1 text-sm">
              Assign tasks to your mentees and track their progress.
            </p>
          </div>
          <div className="mt-5 md:col-span-2 md:mt-0">
            <form onSubmit={handleCreateTask}>
              <div className="grid grid-cols-6 gap-6">
                <div className="col-span-6 sm:col-span-4">
                  <label htmlFor="title" className="label">
                    Task Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    id="title"
                    required
                    value={newTask.title}
                    onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                    className="input"
                  />
                </div>

                <div className="col-span-6">
                  <label htmlFor="description" className="label">
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    rows={3}
                    required
                    value={newTask.description}
                    onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                    className="textarea"
                  />
                </div>

                <div className="col-span-6 sm:col-span-3">
                  <label htmlFor="due-date" className="label">
                    Due Date
                  </label>
                  <input
                    type="date"
                    name="due-date"
                    id="due-date"
                    required
                    value={newTask.dueDate}
                    onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                    className="input"
                  />
                </div>

                <div className="col-span-6">
                  <label className="label">Assign To</label>
                  <div className="mt-1 max-h-48 divide-y divide-gray-100 overflow-y-auto rounded-xl border border-gray-200 dark:divide-slate-700/60 dark:border-slate-700">
                    {assignedStudents.map((student) => (
                      <div key={student.id} className="relative flex items-start p-3">
                        <div className="flex h-5 items-center">
                          <input
                            type="checkbox"
                            checked={newTask.assignedTo.includes(student.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setNewTask({
                                  ...newTask,
                                  assignedTo: [...newTask.assignedTo, student.id],
                                });
                              } else {
                                setNewTask({
                                  ...newTask,
                                  assignedTo: newTask.assignedTo.filter((id) => id !== student.id),
                                });
                              }
                            }}
                            className="h-4 w-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500 dark:border-slate-600"
                          />
                        </div>
                        <div className="ml-3 text-sm">
                          <label className="font-medium text-gray-900 dark:text-slate-200">{student.name}</label>
                          <p className="muted">{student.email}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="mt-5">
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary"
                >
                  {loading ? 'Creating...' : 'Create Task'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Task List */}
      <div className="card overflow-hidden">
        <ul className="divide-y divide-gray-100 dark:divide-slate-700/60">
          {tasks.map((task) => (
            <li key={task.id}>
              <div className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="min-w-0 flex-1">
                    <h4 className="truncate text-sm font-semibold text-gray-900 dark:text-white">{task.title}</h4>
                    <p className="muted mt-1 text-sm">{task.description}</p>
                  </div>
                  <div className="ml-4 flex flex-shrink-0 items-center space-x-4">
                    <p className="muted text-sm">
                      Due: {new Date(task.dueDate).toLocaleDateString()}
                    </p>
                    <select
                      value={task.status}
                      onChange={(e) => handleUpdateTaskStatus(task.id, e.target.value)}
                      className="select h-auto w-auto py-1.5 pr-8 pl-2.5 text-sm"
                    >
                      <option value="PENDING">Pending</option>
                      <option value="IN_PROGRESS">In Progress</option>
                      <option value="COMPLETED">Completed</option>
                    </select>
                  </div>
                </div>
                <div className="mt-2">
                  <div className="flex space-x-2">
                    {(task.assignedTo || []).map((student) => (
                      <span
                        key={student?.id || student}
                        className="badge-neutral"
                      >
                        {student?.name || student?.firstName || student || 'Unknown'}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default TaskManagement; 
