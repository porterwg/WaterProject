import { useEffect, useState } from 'react';
import { Project } from './types/Project';

function ProjectList() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [pageSize, setPageSize] = useState<number>(10);

  useEffect(() => {
    const fetchProjects = async () => {
      const response = await fetch(
        `https://localhost:5000/api/Water/AllProjects?pageHowMany=${pageSize}`
      );
      const data = await response.json();
      setProjects(data);
    };
    fetchProjects();
  }, [pageSize]);

  return (
    <>
      <h1>Water Projects</h1>
      <br />
      {projects.map((p) => (
        <div id="projectCard" className="card" key={p.projectId}>
          <h3 className="card-title">{p.projectName}</h3>
          <div className="card-body">
            <ul className="list-unstyled">
              <li>
                <strong>Project Type: {p.projectType}</strong>
              </li>
              <li>
                <strong>Regional Program: {p.projectRegionalProgram}</strong>
              </li>
              <li>
                <strong>Impact: {p.projectImpact} people served</strong>
              </li>
              <li>
                <strong>Project Phase: {p.projectPhase}</strong>
              </li>
              <li>
                <strong>Project Status: {p.projectFunctionalityStatus}</strong>
              </li>
            </ul>
          </div>
        </div>
      ))}

      <br />
      <label>
        Results per page:
        <select
          value={pageSize}
          onChange={(p) => setPageSize(Number(p.target.value))}
        >
          <option value="5">5</option>
          <option value="10">10</option>
          <option value="20">20</option>
        </select>
      </label>
    </>
  );
}

export default ProjectList;
