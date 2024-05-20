import 'bootstrap/dist/css/bootstrap.css';
import "bootstrap-icons/font/bootstrap-icons.css";
import '../App.css';
import 'react-toastify/dist/ReactToastify.css';
import api from '../services/api';
import { handleDownload } from './downloadFile';
import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { ToastContainer, toast } from 'react-toastify';

export const AddTask = () => {
    const [title, setTitle] = useState("");
    const [sla, setSla] = useState("");
    const [archive, setFile] = useState("");

    const handleSubmit = async (event) => {
        event.preventDefault();

        const data = new FormData();
        data.append('title', title);
        data.append('sla', sla);
        data.append('archive', archive);
                
        await api.post("AddTask", data, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          })

        alert("Tarefa adicionada");
    }

    return(
        <div className='container'>
            <div className='title'>
                <h1>Lista de Tarefas</h1>
            </div>
            <form onSubmit={handleSubmit} className='row'>
                <div className='col'>
                    <label className='form-label'>Título</label>
                    <input className='form-control' type="text" value={title} 
                        onChange={(e) => setTitle(e.target.value)}/>
                </div>

                <div className='col'>
                    <label className='form-label'>SLA</label>
                    <input className='form-control' type="datetime-local" value={sla} 
                        onChange={(e) => setSla(e.target.value)}/>
                </div>
                
                <div className='col'>
                    <label className='form-label'>Arquivo</label>
                    <input className='form-control' type="file" name="archive"
                        onChange={(e) => setFile(e.target.files[0])} />
                </div>
                <div>
                <button className='btn btn-primary' type="Submit">
                    Criar Tarefa
                </button>
                </div>
            </form>
        </div>
    );
}

export const List = () => {
  const [tasks, setTask] = useState([]);

  useEffect(() => {
    api.get('GetTasks').then(({data}) => 
    {
        data.forEach(t =>
            t.sla = format(t.sla, 'HH:mm dd/MM/yyyy')
        )
        data.forEach(t =>
            t.needNotify ? NotifiedTask(t.id) : null
        )
        data.forEach(t =>
            t.needNotify ? toast.info('A tarefa ' + t.title + ' venceu') : null
        )
        
        setTask(data)
    })
  });

  return(
    <div className='container'>
    <div className='container lista'>
        <div className='cabecalho row'>
            <div className='col'>Tarefa</div>
            <div className='col'>SLA</div>
            <div className='col'>Nome do arquivo</div>
            <div className='col-sm-1'>Excluir</div>
            <div className='col-sm-1'>Concluir</div>
        </div>
        { tasks.map(item => 
            !item.isPastDue && !item.done ? (
                <div className='row' key={item.id}>
                <div className='col lista-itens'>{item.title}</div>
                <div className='col lista-itens'>{item.sla}</div>
                <div className='col lista-itens'>{item.fileName != 'Sem arquivo' ? (
                    <a href='' onClick={() => handleDownload(item.fileName)}>{item.fileName}</a>
                ) : item.fileName
                }
                </div>
                <div className='col-sm-1 lista-itens'><i type="button" className="bi-x-circle" onClick={() => deleteTask(item.id)}/></div>
                <div className='col-sm-1 lista-itens'><i type="button" className="bi bi-check2-circle" onClick={() => doneTask(item.id)}/></div>
                </div>
                
            ) : null
        )}
        </div>
        <div>
            <ToastContainer
                position="bottom-right"
                autoClose={10000}
                hideProgressBar={false}
                closeOnClick={true}
                pauseOnHover={true}
                draggable={true}
                style={{ zIndex: 9999 }}
            />
            {/* Seu conteúdo */}
        </div>

        <h2>Tarefas Vencidas</h2>
        <div className='container lista-vencidas'>
        <div className='cabecalho row'>
            <div className='col'>Tarefa</div>
            <div className='col'>SLA</div>
            <div className='col'>Nome do arquivo</div>
            <div className='col-sm-1'>Excluir</div>
            <div className='col-sm-1'>Concluir</div>
        </div>
        { tasks.map(item => 
            item.isPastDue && !item.done ? (
                <div className='row' key={item.id}>
                <div className='col lista-itens'>{item.title}</div>
                <div className='col lista-itens'>{item.sla}</div>
                <div className='col lista-itens'>{item.fileName != 'Sem arquivo' ? (
                    <a href='' onClick={() => handleDownload(item.fileName)}>{item.fileName}</a>
                ) : item.fileName
                }
                </div>
                <div className='col-sm-1 lista-itens'><i type="button" className="bi-x-circle" onClick={() => deleteTask(item.id)}/></div>
                <div className='col-sm-1 lista-itens'><i type="button" className="bi bi-check2-circle" onClick={() => doneTask(item.id)}/></div>
                </div>
                
            ) : null
        )}
        </div>
        <h2>Tarefas Concluídas</h2>
        <div className='container lista-concluidas'>
        <div className='cabecalho row'>
            <div className='col'>Tarefa</div>
            <div className='col'>SLA</div>
            <div className='col'>Nome do arquivo</div>
            <div className='col-sm-1'>Excluir</div>
        </div>
        { tasks.map(item => 
            item.done ? (
                <div className='row' key={item.id}>
                <div className='col lista-itens'>{item.title}</div>
                <div className='col lista-itens'>{item.sla}</div>
                <div className='col lista-itens'>{item.fileName != 'Sem arquivo' ? (
                    <a href='' onClick={() => handleDownload(item.fileName)}>{item.fileName}</a>
                ) : item.fileName
                }
                </div>
                <div className='col-sm-1 lista-itens'><i type="button" className="bi-x-circle" onClick={() => deleteTask(item.id)}/></div>
                </div>
                
            ) : null
        )}
        </div>
    </div>
  );

    async function deleteTask(id){
        await api.delete(`DeleteTask/${id}`);
        setTask(prevTasks => prevTasks.filter(task => task.id !== id));
    }

    async function doneTask(id){
        await api.patch(`DoneTask/${id}`);
    }

    async function NotifiedTask(id){
        await api.patch(`NotifiedTask/${id}`);
    }
}
