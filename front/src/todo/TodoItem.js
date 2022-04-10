import React, {useContext, useState} from 'react'
import PropTypes from 'prop-types'
import Context from '../Context';
import DateTimePicker from 'react-datetime-picker';
import FileList from './FileList';

const styles = {
    li: {
        display: 'flex',
        width: 'inherit',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '.5rem'
    },
    input: {
        marginRight: '.5rem'
    },
    outerContainer: {
        flexDirection: 'column',
        border: '1px solid #ccc',
        borderRadius: '4px',
        marginBottom: '.5rem',
        },
    innerContiner: {
        boxSizing: 'border-box',
        padding: '.5rem 1rem',
        width: '100%',
        display: 'flex'
    }
}

function useInputValue(id, defaultDate = null, callback) { 
    const [dueDate, setDueDate] = useState(defaultDate);
    return {
        bindDate: {
            value: dueDate,
            onChange: newValue => {
                if (callback != null) {
                    callback(id, newValue);
                }
                setDueDate(newValue)
            },
            name: 'dueDate'
        },
        clearDate: () => setDueDate(new Date()),
        dueDate: () => dueDate
    }
}

function isValidDate(d) {
    return d instanceof Date && d != null && !isNaN(d);
}

function TodoItem({todo, index, onChange}) {
    const {deleteTodo, changeDueTo} = useContext(Context);
    const classes = [];

    const dateBind = useInputValue(todo._id, isValidDate(todo.dueTo) ? todo.dueTo : null, changeDueTo);

    if (todo.isCompleted) {
        classes.push('completed');
    }       
    return (
        <div style={styles.outerContainer}>
            <div style={styles.innerContiner}>
                <li style={styles.li}>
                    <span className={classes.join(' ')}>
                        <input type='checkbox'
                        style={styles.input}  
                        checked={todo.isCompleted}
                        onChange={() => onChange(todo._id)}/>
                        <strong>{index + 1}</strong>
                        &nbsp;
                        {todo.title}
                    </span>
                    <button onClick={() => deleteTodo(todo._id)}>&times;</button>
                </li>
            </div>
            <div style={styles.innerContiner}>
                <DateTimePicker {...dateBind.bindDate} />
            </div>
            {todo.files && 
            <div style={styles.innerContiner}>
                <FileList fileList={todo.files} />
            </div>
            }
            
        </div>
    )
}

TodoItem.propTypes = {
    todo: PropTypes.object.isRequired,
    index: PropTypes.number,
    onChange: PropTypes.func.isRequired
}

export default TodoItem;