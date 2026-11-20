import Service from "../models/Services.js";

export const getAllServices = async (req, res)=>{
    const services = await Service.find();
    return res.status(200).json(services);
}

export const getServiceById = async (req, res)=>{
    const service = await Service.findById(req.params.id);
    return res.status(200).json(service);
}

export const createService = async (req, res)=>{
    const service = new Service(req.body);
    await service.save();
    return res.status(201).json(service);
}

export const updateService = async (req, res)=>{
    const service = await Service.findByIdAndUpdate(req.params.id, req.body, {new: true});
    return res.status(200).json(service);
}