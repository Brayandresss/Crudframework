import React, {useEffect, useState} from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import {Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import axios from 'axios';


function App() {
  const baseUrl="http://localhost/proyectos/ApiFrameworks/";
  const [data, setData]=useState([]);
  const [modalInsertar, setModalInsertar]=useState(false);
  const [modalEditar, setModalEditar]=useState(false);
  const [modalEliminar, setModalEliminar]=useState(false);
  const [frameworkSeleccionado, setFrameworkSeleccionado]=useState({
    Id: '',
    Nombre: '',
    Lanzamiento: '',
    Desarrollador: ''
  });

  const handleChange=e=>{
    const {name, value}=e.target;
    setFrameworkSeleccionado((prevState)=>({
      ...prevState,
      [name]: value
    }))
    console.log(frameworkSeleccionado);
  }


  const abrirCerrarModalInsertar=()=>{
    setModalInsertar(!modalInsertar);
  }

  const abrirCerrarModalEditar=()=>{
    setModalEditar(!modalEditar);
  }

  const abrirCerrarModalEliminar=()=>{
    setModalEliminar(!modalEliminar);
  }

  const peticionesGet=async()=>{
    await axios.get(baseUrl)
    .then(response=>{
      setData(response.data);
    }).catch(error=>{
      console.log(error);
    })
  }

  const peticionesPost=async()=>{
    var f = new FormData();
    f.append("Nombre", frameworkSeleccionado.Nombre);
    f.append("Lanzamiento", frameworkSeleccionado.Lanzamiento);
    f.append("Desarrollador", frameworkSeleccionado.Desarrollador);
    f.append("METHOD", "POST");
    await axios.post(baseUrl, f)
    .then(response=>{
      setData(data.concat(response.data));
      abrirCerrarModalInsertar();
    }).catch(error=>{
      console.log(error);
      })
  }


const peticionesPut=async()=>{
    var f = new FormData();
    f.append("Nombre", frameworkSeleccionado.Nombre);
    f.append("Lanzamiento", frameworkSeleccionado.Lanzamiento);
    f.append("Desarrollador", frameworkSeleccionado.Desarrollador);
    f.append("METHOD", "PUT");
    await axios.post(baseUrl, f, {params: {Id: frameworkSeleccionado.Id}})
    .then(response=>{
      var dataNueva = data;
      dataNueva.map(framework=>{
        if(framework.Id===frameworkSeleccionado.Id){
          framework.Nombre=frameworkSeleccionado.Nombre;
          framework.Lanzamiento=frameworkSeleccionado.Lanzamiento;
          framework.Desarrollador=frameworkSeleccionado.Desarrollador;
        }
      });
      setData(dataNueva);
      abrirCerrarModalEditar();
    }).catch(error=>{
      console.log(error);
      })
  }

  const peticionesDelete=async()=>{
    var f = new FormData();
    f.append("METHOD", "DELETE");
    await axios.post(baseUrl, f, {params:{Id: frameworkSeleccionado.Id}})
    .then(response=>{
      setData(data.filter(framework=>framework.Id!==frameworkSeleccionado.Id));
      abrirCerrarModalEliminar();
    }).catch(error=>{
      console.log(error);
    })
  }


  const seleccionarFramework=(framework, caso)=>{
    setFrameworkSeleccionado(framework);

    (caso==="Editar")?
    abrirCerrarModalEditar():
    abrirCerrarModalEliminar()
    
  }


useEffect(()=>{
  peticionesGet();
},[])


  return (
    <div style={{textAlign: 'center'}}>
    <br/>
    <button className="btn btn-success" onClick={()=>abrirCerrarModalInsertar()}>Insertar</button>
    <br/><br/>
    <table className="table table-striped">
      <thead>
        <tr>
          <th>ID</th>
          <th>NOMBRE</th>
          <th>LANZAMIENTO</th>
          <th>DESARROLLADOR</th>
          <th>ACCIONES</th>
        </tr>
      </thead>
      <tbody>
        {data.map(framework=>(
          <tr key={framework.Id}>
            <td>{framework.Id}</td>
            <td>{framework.Nombre}</td>
            <td>{framework.Lanzamiento}</td>
            <td>{framework.Desarrollador}</td>

          <td>
          <button className="btn btn-primary" onClick={()=>seleccionarFramework(framework, "Editar")}>Editar</button> {" "}
          <button className="btn btn-danger" onClick={()=>seleccionarFramework(framework, "Eliminar")}>Eliminar</button>
          </td> 
          </tr>
      ))}
    
      </tbody>
    </table>

    <Modal isOpen={modalInsertar}>
      <ModalHeader>Insertar framework</ModalHeader>
      <ModalBody>
        <div className="form-group">
        <label>Nombre: </label>
        <br/>
        <input type="text" className="form-control" name="Nombre" onChange={handleChange}/>
        <br/>
        <label>Lanzamiento: </label>
        <br/>
        <input type="text" className="form-control" name="Lanzamiento" onChange={handleChange}/>
        <br/>
        <label>Desarrollador: </label>
        <br/>
        <input type="text" className="form-control" name="Desarrollador" onChange={handleChange}/>
        <br/>
        </div>
      </ModalBody>
      <ModalFooter>
        <button className="btn btn-primary" onClick={()=>peticionesPost()}>Insertar</button>{"  "}
        <button className="btn btn-danger" onClick={()=>abrirCerrarModalInsertar()}>Cancelar</button>
      </ModalFooter>
    </Modal>


    <Modal isOpen={modalEditar}>
      <ModalHeader> Editar framework </ModalHeader>
      <ModalBody>
        <div className="form-group">
        <label>Nombre: </label>
        <br />
        <input type="text" className="form-control" name="Nombre" onChange={handleChange} value={frameworkSeleccionado && frameworkSeleccionado.Nombre}/>
        <br/>
        <label>Lanzamiento: </label>
        <br />
        <input type="text" className="form-control" name="Lanzamiento" onChange={handleChange} value={frameworkSeleccionado && frameworkSeleccionado.Lanzamiento}/>
        <br/>
        <label>Desarrollador: </label>
        <br />
        <input type="text" className="form-control" name="Desarrollador" onChange={handleChange} value={frameworkSeleccionado && frameworkSeleccionado.Desarrollador}/>
        <br/>
        </div>
      </ModalBody>
      <ModalFooter>
        <button className="btn btn-primary" onClick={()=>peticionesPut()}>Editar</button>{"  "}
        <button className="btn btn-danger" onClick={()=>abrirCerrarModalEditar()}>Cancelar</button>
      </ModalFooter>
    </Modal>



    <Modal isOpen={modalEliminar}>
      <ModalBody>
        ¿Estas seguro de querer eliminar el framework {frameworkSeleccionado && frameworkSeleccionado.Nombre}?
      </ModalBody>
      <ModalFooter>
        <button className="btn btn-danger" onClick={()=>peticionesDelete()}>
          Si
        </button>
        <button className="btn btn-secundary" onClick={()=>abrirCerrarModalEliminar()}>
          No
        </button>
      </ModalFooter>
    </Modal>

    </div>
  );
}

export default App;
