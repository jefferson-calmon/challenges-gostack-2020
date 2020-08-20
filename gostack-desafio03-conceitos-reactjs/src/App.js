import React, { useState, useEffect, useCallback } from "react";

import api from "./services/api";

import "./styles.css";

function App() {
  const [ repositories, setRepositories ] = useState([]);

  useEffect(() => {
    api.get('repositories').then(response => setRepositories(response.data))
  }, [])

  async function handleAddRepository() {
    const response = await api.post('repositories', {
      title: "Novo repositório",
      url: "https://github.com/rocketseat-education/bootcamp-gostack-desafios/tree/master/desafio-conceitos-nodejs",
      techs: [
        "NodeJS",
        "ReactJS",
        "React Native"
	    ]
    })

    return setRepositories([ ...repositories, response.data ])
  };

  // async function handleRemoveRepository(id) {
  //   await api.delete(`/repositories/${id}`);


  //   return setRepositories(oldValue => {
  //     const repo = oldValue;
  //     const idArray = repo.findIndex(repositorie => repositorie.id === id);
  //     repo.splice(idArray, 1);
  //     return [...repo];
  //   });
  // };

  const handleRemoveRepository = useCallback( async (id) => {
    await api.delete(`/repositories/${id}`);


    return setRepositories(oldValue => {
      const repo = oldValue;
      const idArray = repo.findIndex(repositorie => repositorie.id === id);
      repo.splice(idArray, 1);
      return [...repo];
    });
  }, [])

  return (
    <div>
      <ul data-testid="repository-list">
        {
          repositories.map(repositorie => (
            
            <li key={repositorie.id}>
              {repositorie.title}

              <button onClick={() => handleRemoveRepository(repositorie.id)}>
                Remover
              </button>
            </li>
          ))
        }
      </ul>

      <button onClick={handleAddRepository}>Adicionar</button>
    </div>
  );
}

export default App;
