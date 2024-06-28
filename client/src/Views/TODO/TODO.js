import { useEffect, useState } from 'react';
import Styles from './TODO.module.css';
import { dummy } from './dummy';
import axios from 'axios';

export function TODO(props) {
    const [newTodo, setNewTodo] = useState('');
    const [todoData, setTodoData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingTodoId, setEditingTodoId] = useState(null);
    const [editingTitle, setEditingTitle] = useState('');
    const [editingDescription, setEditingDescription] = useState('');


    useEffect(() => {
        const fetchTodo = async () => {
            const apiData = await getTodo();
            if (apiData.length > 0) setTodoData(apiData);
            setLoading(false);
        }
        fetchTodo();
    }, []);

    const getTodo = async () => {
        const options = {
            method: "GET",
            url: `http://localhost:8000/api/todo`,
            headers: {
                accept: "application/json",
            }
        }
        try {
            const response = await axios.request(options);
            return response.data;
        } catch (err) {
            console.log(err);
            return []; // return an empty array in case of error
        }
    }

    const addTodo = () => {
        const options = {
            method: "POST",
            url: `http://localhost:8000/api/todo`,
            headers: {
                accept: "application/json",
            },
            data: {
                title: newTodo
            }
        }
        axios
            .request(options)
            .then(function (response) {
                console.log(response.data);
                setTodoData(prevData => [...prevData, response.data]);
                setNewTodo(''); 
            })
            .catch((err) => {
                console.log(err);
            });
    }

    const deleteTodo = (id) => {
        setTodoData(prevData => prevData.filter(todo => todo._id !== id));

        const options = {
            method: "DELETE",
            url: `http://localhost:8000/api/todo/${id}`,
            headers: {
                accept: "application/json",
            }
        }
        axios
            .request(options)
            .then(function (response) {
                console.log(response.data);
            })
            .catch((err) => {
                console.log(err);
                setTodoData(prevData => [...prevData, dummy.find(todo => todo._id === id)]);
            });
    };

    const updateTodo = (id) => {
        const todoToUpdate = todoData.find(todo => todo._id === id);
        const options = {
            method: "PATCH",
            url: `http://localhost:8000/api/todo/${id}`,
            headers: {
                accept: "application/json",
            },
            data: {
                ...todoToUpdate,
                done: !todoToUpdate.done
            }
        }
        axios
            .request(options)
            .then(function (response) {
                console.log(response.data);
                setTodoData(prevData => prevData.map(todo => todo._id === id ? response.data : todo));
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const saveEdit = (id) => {
        const options = {
            method: "PATCH",
            url: `http://localhost:8000/api/todo/${id}`,
            headers: {
                accept: "application/json",
            },
            data: {
                title: editingTitle,
            }
        }
        axios
            .request(options)
            .then(function (response) {
                console.log(response.data);
                setTodoData(prevData => prevData.map(todo => todo._id === id ? response.data : todo));
                setEditingTodoId(null);
                setEditingTitle('');
            })
            .catch((err) => {
                console.log(err);
            });
    };

    return (
        <div className={Styles.ancestorContainer}>
            <div className={Styles.headerContainer}>
                <h1>Tasks</h1>
                <span>
                    <input
                        className={Styles.todoInput}
                        type='text'
                        name='New Todo'
                        value={newTodo}
                        onChange={(event) => setNewTodo(event.target.value)}
                    />
                    <button
                        id='addButton'
                        name='add'
                        className={Styles.addButton}
                        onClick={() => {
                            addTodo();
                            setNewTodo('');
                        }}
                    >
                        + New Todo
                    </button>
                </span>
            </div>
            <div id='todoContainer' className={Styles.todoContainer}>
                {loading ? (
                    <p style={{ color: 'white' }}>Loading...</p>
                ) : (
                    todoData.length > 0 ? (
                        todoData.map((entry, index) => (
                            <div key={entry._id} className={Styles.todo}>
                                <span className={Styles.infoContainer}>
                                    <input
                                        type='checkbox'
                                        checked={entry.done}
                                        onChange={() => updateTodo(entry._id)}
                                    />
                                    {editingTodoId === entry._id ? (
                                        <input
                                            type='text'
                                            value={editingTitle}
                                            onChange={(e) => setEditingTitle(e.target.value)}
                                        />
                                    ) : (
                                        entry.title
                                    )}
                                </span>
                                
                                {/* <span><button onClick={descriptionFun}>Store Desc</button></span> */}
                                <span className={Styles.todoDescID}><input className={Styles.DescTextID} type="text"/></span>
                                
                                <span
                                    style={{ cursor: 'pointer' }}
                                    onClick={() => deleteTodo(entry._id)}
                                >
                                    Delete
                                </span>
                                
                                {editingTodoId === entry._id ? (
                                    <span
                                        style={{ cursor: 'pointer' }}
                                        onClick={() => saveEdit(entry._id)}
                                    >
                                        Save
                                    </span>
                                ) : (
                                    <span
                                        style={{ cursor: 'pointer' }}
                                        onClick={() => {
                                            setEditingTodoId(entry._id);
                                            setEditingTitle(entry.title);
                                        }}
                                    >
                                        Edit
                                    </span>
                                )}
                            </div>
                        ))
                    ) : (
                        <p className={Styles.noTodoMessage}>No tasks available. Please add a new task.</p>
                    )
                )}
            </div>
        </div>

    );
}
