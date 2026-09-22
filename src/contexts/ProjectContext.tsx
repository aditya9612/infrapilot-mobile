import React, { createContext, useContext, useEffect, useState } from 'react';
import { Project, projectService } from '../services/projectService';
import { settingsService } from '../services/settingsService';

interface ProjectContextData {
    activeProjectId: number | null;
    activeProjectName: string;
    projects: Project[];
    setActiveProject: (id: number | null) => void;
    loading: boolean;
}

const ProjectContext = createContext<ProjectContextData>({
    activeProjectId: null,
    activeProjectName: '',
    projects: [],
    setActiveProject: () => { },
    loading: true,
});

export const ProjectProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [activeProjectId, setActiveProjectId] = useState<number | null>(null);
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                // Fetch projects
                const responseData = await projectService.getProjects();
                const projectsArray = Array.isArray(responseData) ? responseData : ((responseData as any)?.data || (responseData as any)?.items || (responseData as any)?.projects || []);
                setProjects(projectsArray);

                // Fetch default project from settings
                let defaultId = null;
                try {
                    const settings = await settingsService.getSettings();
                    if (settings.default_project_id) {
                        defaultId = settings.default_project_id;
                    }
                } catch (err) {
                    console.log('Failed to fetch default project from settings, using fallback');
                }

                if (defaultId && projectsArray.some((p: any) => p.id === defaultId || p.project_id === defaultId)) {
                    setActiveProjectId(defaultId);
                } else if (projectsArray.length > 0) {
                    setActiveProjectId(projectsArray[0].id ?? projectsArray[0].project_id);
                }
            } catch (error) {
                console.error('Failed to load project context:', error);
                // Fallback mock for UI dev
                const mockProjects = [
                    { id: 1, name: 'Sara City' },
                    { id: 2, name: 'Infra Complex Phase 2' }
                ];
                setProjects(mockProjects);
                setActiveProjectId(1);
            } finally {
                setLoading(false);
            }
        };

        fetchInitialData();
    }, []);

    const activeProject = projects.find((p: any) => p.id === activeProjectId || p.project_id === activeProjectId);
    const activeProjectName = (activeProject as any)?.name || (activeProject as any)?.project_name || 'Unnamed Project';

    return (
        <ProjectContext.Provider value={{
            activeProjectId,
            activeProjectName,
            projects,
            setActiveProject: setActiveProjectId,
            loading
        }}>
            {children}
        </ProjectContext.Provider>
    );
};

export const useProjectContext = () => useContext(ProjectContext);
