import type { CreateTravelPlanRequestDto } from '../types/travelPlan.type';
import type { PlanParticipant, PlanComment } from '../types/travelPlan.type';
import type { UpdateTravelPlanRequestDto } from '../types/travelPlan.type';
import api from '../utils/api';
import type {
    TravelPlan,
    PlannedPlace,
    TravelPlanServiceUnifiedDTO
} from '../types/travelPlan.type';
import { API_ENDPOINTS } from '../constants/path.constants';
import { notifyParticipantAdded, notifyCommentAdded } from './notification.service';

const TRAVEL_PLANS_BASE_URL = API_ENDPOINTS.TRAVEL_PLANS;

// all the get services
export const getAllTravelPlans = async (filters?: { user_id?: string; name?: string }): Promise<TravelPlan[]> => {
    const params = filters ? { ...filters } : {};
    const res = await api.get(TRAVEL_PLANS_BASE_URL, { params });
    return res.data.data;
};

export const getTravelPlanById = async (plan_id: string): Promise<TravelPlan> => {
    const res = await api.get(`${TRAVEL_PLANS_BASE_URL}/${plan_id}`);
    return res.data.data;
};


export const getPlannedPlaces = async (plan_id: string): Promise<PlannedPlace[]> => {
    try {
        const res = await api.get(`${TRAVEL_PLANS_BASE_URL}/${plan_id}/places`);
        return res.data.data;
    } catch (err: any) {
        if (err.response && err.response.status === 404 && err.response.data?.data === null) {
            return [];
        }
        throw err;
    }
};


export const getPlanServices = async (plan_id: string): Promise<TravelPlanServiceUnifiedDTO[]> => {
    try {
        const res = await api.get(`${TRAVEL_PLANS_BASE_URL}/${plan_id}/services`);
        return res.data.data;
    } catch (err: any) {
        if (err.response && err.response.status === 404) {
            return [];
        }
        throw err;
    }
};


export const getPlanParticipants = async (plan_id: string): Promise<PlanParticipant[]> => {
    try {
        const res = await api.get(`${TRAVEL_PLANS_BASE_URL}/${plan_id}/participants`);
        return res.data.data;
    } catch (err: any) {
        if (err.response && err.response.status === 404 && err.response.data?.data === null) {
            return [];
        }
        throw err;
    }
};



export const getPlanComments = async (plan_id: string): Promise<PlanComment[]> => {
    try {
        const res = await api.get(`${TRAVEL_PLANS_BASE_URL}/${plan_id}/comments`);
        return res.data.data;
    } catch (err: any) {
        if (err.response && err.response.status === 404 && err.response.data?.data === null) {
            return [];
        }
        throw err;
    }
};

// all the create services
export const createTravelPlan = async (data: CreateTravelPlanRequestDto): Promise<TravelPlan> => {
    const res = await api.post(TRAVEL_PLANS_BASE_URL, data);
    return res.data.data;
};

export const addPlannedPlace = async (plan_id: string, data: { place_id: string; priority?: string }): Promise<PlannedPlace> => {
    const res = await api.post(`${TRAVEL_PLANS_BASE_URL}/${plan_id}/places`, data);
    return res.data.data;
};

export const addPlanParticipant = async (plan_id: string, data: { user_id: number; is_going?: boolean; role_permission: string }, currentUserId?: number): Promise<PlanParticipant> => {
    const res = await api.post(`${TRAVEL_PLANS_BASE_URL}/${plan_id}/participants`, data);
    const newParticipant = res.data.data;
    
    if (currentUserId && data.user_id !== currentUserId) {
        await notifyParticipantAdded(plan_id, data.user_id, currentUserId);
    }
    
    return newParticipant;
};

export const addPlanComment = async (plan_id: string, data: { content: string }, commenterId?: number): Promise<PlanComment> => {
    const res = await api.post(`${TRAVEL_PLANS_BASE_URL}/${plan_id}/comments`, data);
    const newComment = res.data.data;
    
    if (commenterId) {
        await notifyCommentAdded(plan_id, commenterId, data.content);
    }
    
    return newComment;
};

export const addPlanService = async (plan_id: string, data: TravelPlanServiceUnifiedDTO): Promise<TravelPlanServiceUnifiedDTO> => {
    const res = await api.post(`${TRAVEL_PLANS_BASE_URL}/${plan_id}/services`, data);
    return res.data.data;
};

// all the update servics
export const updateTravelPlan = async (plan_id: string, data: UpdateTravelPlanRequestDto): Promise<TravelPlan> => {
    const res = await api.patch(`${TRAVEL_PLANS_BASE_URL}/${plan_id}`, data);
    return res.data.data;
};

export const updatePlanService = async (plan_id: string, service_id: string, data: TravelPlanServiceUnifiedDTO): Promise<TravelPlanServiceUnifiedDTO> => {
    const res = await api.patch(`${TRAVEL_PLANS_BASE_URL}/${plan_id}/services/${service_id}`, data);
    return res.data.data;
};

export const updatePlanParticipant = async (plan_id: string, user_id: number, data: Partial<PlanParticipant>, currentUserId?: number): Promise<PlanParticipant> => {
    const res = await api.patch(`${TRAVEL_PLANS_BASE_URL}/${plan_id}/participants/${user_id}`, data);
    const updatedParticipant = res.data.data;
    
    if (currentUserId && user_id !== currentUserId && data.role_permission) {
        await notifyParticipantAdded(plan_id, user_id, currentUserId);
    }
    
    return updatedParticipant;
};

// all the delete services
export const deletePlanService = async (plan_id: string, service_id: string): Promise<void> => {
    await api.delete(`${TRAVEL_PLANS_BASE_URL}/${plan_id}/services/${service_id}`);
};

export const deleteTravelPlan = async (plan_id: string): Promise<void> => {
    await api.delete(`${TRAVEL_PLANS_BASE_URL}/${plan_id}`);
};

export const deletePlanParticipant = async (plan_id: string, user_id: number): Promise<void> => {
    await api.delete(`${TRAVEL_PLANS_BASE_URL}/${plan_id}/participants/${user_id}`);
};

