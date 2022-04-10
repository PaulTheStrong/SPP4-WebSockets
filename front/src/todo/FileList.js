import React from 'react'

function FileList({fileList}) {

    return (
        <div>
        {
        fileList.map(file => {
            return (
            <div>
                <a href={"http://127.0.0.1:10000/tasks/file/" + file} download>{file}</a> 
            </div>
            );
        })
        }
        </div>
    )
}

export default FileList;