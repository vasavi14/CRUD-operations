import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';

export default function JSONServer() {
    const [data, setData] = useState([]);
    const [editId, setEditId] = useState(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = () => {
        fetch('http://localhost:3001/User')
            .then(res => res.json())
            .then(data => setData(data))
            .catch(error => console.error('Error fetching data:', error));
    };

    const handleRemove = (id) => {
        fetch(`http://localhost:3001/User/${id}`, {
            method: 'DELETE'
        }).then(() => {
            setData(data.filter(item => item.id !== id));
        }).catch(error => console.error('Error deleting data:', error));
    };

    const handleSubmit = (values) => {
        if (editId !== null) {
            fetch(`http://localhost:3001/User/${editId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(values)
            }).then(() => {
                fetchData();
                setEditId(null);
                formik.resetForm();
            }).catch(error => console.error('Error updating data:', error));
        } else {
            fetch('http://localhost:3001/User', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(values)
            }).then(() => {
                fetchData();
                formik.resetForm();
            }).catch(error => console.error('Error adding data:', error));
        }
    };

    const handleEdit = (id) => {
        const itemToEdit = data.find(item => item.id === id);
        if (itemToEdit) {
            formik.setValues(itemToEdit);
            setEditId(id);
        }
    };

    const formik = useFormik({
        initialValues: {
            id: "",
            name: "",
            email: "",
        },
        validate: (values) => {
            let errors = {};
            if (!values.id) {
                errors.id = "*ID required"
            }
            if (!values.name) {
                errors.name = "*Name required"
            }
            if (!values.email) {
                errors.email = "*Email required"
            }
            return errors;
        },
        onSubmit: handleSubmit
    })
    const formstyle={
        border:"2px solid blue",
        borderRadius:"20px",
        width:"300px",
        height:"40px"
        

    }

    return (
        <div>
            <form onSubmit={formik.handleSubmit} autoComplete='off'><br></br>
                <input   type="text" name="id" placeholder="Enter Id" value={formik.values.id} onChange={formik.handleChange} disabled={editId !== null} style={formstyle} />
                <br />
                <br />
                {formik.errors.id ? <div style={{color:"red"}}>{formik.errors.id}</div> : null}

                <input type="text" name="name" placeholder='Enter Name' value={formik.values.name} onChange={formik.handleChange} style={formstyle}/><br /><br></br>

                {formik.errors.name ? <div style={{color:"red"}}>{formik.errors.name}</div> : null}

                <input type="text" name="email" placeholder='Enter Email' value={formik.values.email} onChange={formik.handleChange} style={formstyle}/><br /><br></br>
                {formik.errors.email ? <div style={{color:"red"}}>{formik.errors.email}</div> : null}

                <button type="submit" className='btn  btn-success'>{editId !== null ? 'Update' : 'Add'}</button>
            </form><br></br>

            <table className='table table-hover'>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((d, i) => (
                        <tr key={i}>
                            <td>{d.id}</td>
                            <td>{d.name}</td>
                            <td>{d.email}</td>
                            <td>
                                <button onClick={() => handleRemove(d.id)} className='btn btn-danger'>Delete</button>
                                <button onClick={() => handleEdit(d.id)} className='btn btn-primary'>Edit</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
