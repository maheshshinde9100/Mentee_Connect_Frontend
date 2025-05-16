import React, { useState, useEffect } from 'react';
import { mentorService } from '../../services/api';

const TaskManagement = () => {
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
    fetchTasks();
    fetchAssignedStudents();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await mentorService.getTasks();
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAssignedStudents = async () => {
    try {
      const response = await mentorService.getAssignedStudents();
      setAssignedStudents(response.data);
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await mentorService.createTask(newTask);
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
      <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
        <div className="md:grid md:grid-cols-3 md:gap-6">
          <div className="md:col-span-1">
            <h3 className="text-lg font-medium leading-6 text-gray-900">Create New Task</h3>
            <p className="mt-1 text-sm text-gray-500">
              Assign tasks to your mentees and track their progress.
            </p>
          </div>
          <div className="mt-5 md:mt-0 md:col-span-2">
            <form onSubmit={handleCreateTask}>
              <div className="grid grid-cols-6 gap-6">
                <div className="col-span-6 sm:col-span-4">
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                    Task Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    id="title"
                    required
                    value={newTask.title}
                    onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                    className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  />
                </div>

                <div className="col-span-6">
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    rows={3}
                    required
                    value={newTask.description}
                    onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                    className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  />
                </div>

                <div className="col-span-6 sm:col-span-3">
                  <label htmlFor="due-date" className="block text-sm font-medium text-gray-700">
                    Due Date
                  </label>
                  <input
                    type="date"
                    name="due-date"
                    id="due-date"
                    required
                    value={newTask.dueDate}
                    onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                    className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  />
                </div>

                <div className="col-span-6">
                  <label className="block text-sm font-medium text-gray-700">Assign To</label>
                  <div className="mt-1 border border-gray-300 rounded-md max-h-48 overflow-y-auto">
                    {assignedStudents.map((student) => (
                      <div key={student.id} className="relative flex items-start p-3">
                        <div className="flex items-center h-5">
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
                            className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                          />
                        </div>
                        <div className="ml-3 text-sm">
                          <label className="font-medium text-gray-700">{student.name}</label>
                          <p className="text-gray-500">{student.email}</p>
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
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  {loading ? 'Creating...' : 'Create Task'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Task List */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {tasks.map((task) => (
            <li key={task.id}>
              <div className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-indigo-600 truncate">{task.title}</h4>
                    <p className="mt-1 text-sm text-gray-500">{task.description}</p>
                  </div>
                  <div className="ml-4 flex-shrink-0 flex space-x-4">
                    <p className="text-sm text-gray-500">
                      Due: {new Date(task.dueDate).toLocaleDateString()}
                    </p>
                    <select
                      value={task.status}
                      onChange={(e) => handleUpdateTaskStatus(task.id, e.target.value)}
                      className="text-sm text-gray-500 border-gray-300 rounded-md"
                    >
                      <option value="PENDING">Pending</option>
                      <option value="IN_PROGRESS">In Progress</option>
                      <option value="COMPLETED">Completed</option>
                    </select>
                  </div>
                </div>
                <div className="mt-2">
                  <div className="flex space-x-2">
                    {task.assignedTo.map((student) => (
                      <span
                        key={student.id}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                      >
                        {student.name}
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