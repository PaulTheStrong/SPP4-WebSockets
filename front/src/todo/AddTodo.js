import React, {useState} from 'react'
import PropTypes from 'prop-types'

function useInputValue(defaultTitle = '') { 
    const [title, setTitle] = useState(defaultTitle);
    const [dueDate, setDueDate] = useState(null);
    return {
        bind: {
            value: title,
            onChange: event => setTitle(event.target.value),
            minLength: 2,
            maxLength: 255,
            name: 'title'
        },
        bindDate: {
            type: 'datetime-local',
            value: dueDate,
            onChange: event => setDueDate(event.target.value),
            name: 'dueDate'
        },
        clear: () => setTitle(''),
        title: () => title,
        clearDate: () => setDueDate(null),
        dueDate: () => dueDate
    }
}

function AddTodo({onCreate}) {
    const input = useInputValue('');
    const [files, setFiles] = useState('');

    const saveFiles = (e) => {
        console.log("Update files");
        setFiles(e.target.files);
    };

    function submitHandler(event) {
        event.preventDefault();

        if(input.title().trim()) {
            // formData.append("dueTo", input.dueDate() != null ? '"' + input.dueDate() + '"' : null);
            console.log(files)
            let fileNames = [];
            if (files !== null && files !== undefined) {
                for (let i = 0; i < files.length; i++) {
                    fileNames.append(files[i]);
                }
            }
            let newTask = {
                title: input.title(),
                dueDate: input.dueDate(),
            }
    
            let message = {
                type: 'tasks/add',
                task: newTask,
                files: files
            }

            onCreate(message);
            input.clear();
            input.clearDate();
        }
    }

    return (
        <form style={{marginBottom: "1rem"}} onSubmit={submitHandler}>
            <input {...input.bind}/>
            <input {...input.bindDate} />
            <input type="file" onChange={saveFiles} multiple />
            <button type="submit">Add todo</button>
        </form>
    )
}

AddTodo.propTypes = {
    onCreate: PropTypes.func.isRequired
}

export default AddTodo;