import type { CreateTravelPlanRequestDto } from '../types/travelPlan.type';
import type { PlanParticipant, PlanComment } from '../types/travelPlan.type';
import api from '../utils/api';
import type {
    TravelPlan,
    PlannedPlace,
    TravelPlanServiceUnifiedDTO
} from '../types/travelPlan.type';
import { API_ENDPOINTS } from '../constants/path.constants';

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
        if (err.response && err.response.status === 404 && err.response.data?.data === null) {
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
    console.log(('travel plan' , data));

    const res = await api.post(TRAVEL_PLANS_BASE_URL, data);
    return res.data.data;
};

export const addPlannedPlace = async (plan_id: string, data: { place_id: string; priority?: string }): Promise<PlannedPlace> => {
    const res = await api.post(`${TRAVEL_PLANS_BASE_URL}/${plan_id}/places`, data);
    return res.data.data;
};

export const addPlanParticipant = async (plan_id: string, data: { user_id: number; is_going?: boolean; role_permission: string }): Promise<PlanParticipant> => {
    const res = await api.post(`${TRAVEL_PLANS_BASE_URL}/${plan_id}/participants`, data);
    return res.data.data;
};

export const addPlanComment = async (plan_id: string, data: { content: string }): Promise<PlanComment> => {
    const res = await api.post(`${TRAVEL_PLANS_BASE_URL}/${plan_id}/comments`, data);
    return res.data.data;
};

export const addPlanService = async (plan_id: string, data: TravelPlanServiceUnifiedDTO): Promise<TravelPlanServiceUnifiedDTO> => {
    const res = await api.post(`${TRAVEL_PLANS_BASE_URL}/${plan_id}/services`, data);
    return res.data.data;
};

