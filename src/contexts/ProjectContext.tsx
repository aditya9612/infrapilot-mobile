import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Project, projectService } from '../services/projectService';
import { settingsService } from '../services/settingsService';

interface ProjectContextData {
    activeProjectId: number | null;
    activeProjectName: string;
    activeProject: Project | null;
    projects: Project[];
    setActiveProject: (id: number | null) => void;
    loading: boolean;
}

const ProjectContext = createContext<ProjectContextData>({
    activeProjectId: null,
    activeProjectName: '',
    activeProject: null,
    projects: [],
    setActiveProject: () => { },
    loading: true,
});

export const ProjectProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [activeProjectId, setActiveProjectId] = useState<number | null>(null);
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);

    const updateActiveProject = async (id: number | null) => {
        setActiveProjectId(id);
        if (id !== null) {
            await AsyncStorage.setItem('activeProjectId', String(id));
        } else {
            await AsyncStorage.removeItem('activeProjectId');
        }
    };

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                // Fetch projects
                const responseData = await projectService.getProjects();
                const projectsArray = Array.isArray(responseData) ? responseData : ((responseData as any)?.data || (responseData as any)?.items || (responseData as any)?.projects || []);
                setProjects(projectsArray);

                // Fetch default project from async storage first, then settings
                let defaultId = null;
                const storedId = await AsyncStorage.getItem('activeProjectId');
                if (storedId) {
                    defaultId = Number(storedId);
                } else {
                    try {
                        const settings = await settingsService.getSettings();
                        if (settings.default_project_id) {
                            defaultId = settings.default_project_id;
                        }
                    } catch (err) {
                        console.log('Failed to fetch default project from settings, using fallback');
                    }
                }

                if (defaultId && projectsArray.some((p: any) => p.id === defaultId || p.project_id === defaultId)) {
                    setActiveProjectId(defaultId);
                } else if (projectsArray.length > 0) {
                    const firstId = projectsArray[0].id ?? projectsArray[0].project_id;
                    setActiveProjectId(firstId);
                    await AsyncStorage.setItem('activeProjectId', String(firstId));
                }
            } catch (error) {
                console.error('Failed to load project context:', error);
                // Fallback mock for UI dev
                const mockProjects = [
                    { id: 1, name: 'Sara City' },
                    { id: 2, name: 'Infra Complex Phase 2' }
                ];
                setProjects(mockProjects);
                
                const storedId = await AsyncStorage.getItem('activeProjectId');
                setActiveProjectId(storedId ? Number(storedId) : 1);
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
            activeProject: activeProject || null,
            projects,
            setActiveProject: updateActiveProject,
            loading
        }}>
            {children}
        </ProjectContext.Provider>
    );
};

export const useProjectContext = () => useContext(ProjectContext);
