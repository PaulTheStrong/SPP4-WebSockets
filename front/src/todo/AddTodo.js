import React, {useState} from 'react'
import PropTypes from 'prop-types'

function useInputValue(defaultTitle = '') { 
    const [title, setTitle] = useState(defaultTitle);
    const [dueTo, setDueTo] = useState(null);
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
            value: dueTo,
            onChange: event => setDueTo(event.target.value),
            name: 'dueTo'
        },
        clear: () => setTitle(''),
        title: () => title,
        clearDate: () => setDueTo(null),
        dueTo: () => dueTo
    }
}

function AddTodo({onCreate}) {
    const input = useInputValue('');
    const [files, setFiles] = useState();

    const saveFiles = (e) => {
        console.log("Update files");
        setFiles(e.target.files);
    };

    async function submitHandler(event) {
        event.preventDefault();

        if(input.title().trim()) {
            // formData.append("dueTo", input.dueTo() != null ? '"' + input.dueTo() + '"' : null);
            console.log(files)
            let filesData = [];
            if (files !== null && files !== undefined) {
                for (let i = 0; i < files.length; i++) {
                    let buf = await files[i].arrayBuffer();
                    filesData.push({name: files[i].name, buf: new Uint8Array(buf)});
                }
            }
            let newTask = {
                title: input.title(),
                dueTo: input.dueTo(),
            }
    
            let message = {
                type: 'tasks/add',
                task: newTask,
                files: filesData
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