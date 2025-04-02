import { Project } from '../types/Project';

interface FetchProjectsResponse {
  projects: Project[];
  totalNumProjects: number;
}

const api_url = `https://waterproject-graham-backend.azurewebsites.net/api/Water`;

export const fetchProjects = async (
  pageSize: number,
  pageNum: number,
  selectedCategories: string[]
): Promise<FetchProjectsResponse> => {
  try {
    const categoryParams = selectedCategories
      .map((cat) => `projectTypes=${encodeURIComponent(cat)}`)
      .join('&');

    const response = await fetch(
      `${api_url}/AllProjects?pageSize=${pageSize}&pageNum=${pageNum}${selectedCategories.length ? `&${categoryParams}` : ''}`,
      {
        credentials: 'include',
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch projects');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching projects:', error);
    throw error;
  }
};

export const addProject = async (newProject: Project): Promise<Project> => {
  try {
    const response = await fetch(`${api_url}/AddProject`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newProject),
    });

    if (!response.ok) {
      throw new Error('Failed to add project');
    }

    return await response.json();
  } catch (error) {
    console.error('Error adding project', error);
    throw error;
  }
};

export const updateProject = async (
  projectId: number,
  updatedProject: Project
): Promise<Project> => {
  try {
    const response = await fetch(`${api_url}/UpdateProject/${projectId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedProject),
    });

    return await response.json();
  } catch (error) {
    console.error('Error updating project:', error);
    throw error;
  }
};

export const deleteProject = async (projectId: number): Promise<void> => {
  try {
    const response = await fetch(`${api_url}/DeleteProject/${projectId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Failed to delete project');
    }
  } catch (error) {
    console.error('Error deleting project', error);
    throw error;
  }
};
