import { fetchServices } from './fetchServices.js';

async function getServiceFromUrl(url) {
    try {
        const services = await fetchServices();
        console.log('Matching URL:', url);
        const service = services.find(service => url.startsWith(service.url));
        console.log('Matched service:', service);
        return service ? service.name : 'defaultService';
    } catch (error) {
        console.error('Error in getServiceFromUrl:', error);
        return 'defaultService';
    }
}

export { getServiceFromUrl };
