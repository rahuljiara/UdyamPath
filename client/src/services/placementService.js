import api from './api';
import initialOffers from '../data/offers.json';

const formatOffer = (o) => ({
  ...o,
  id: o._id || o.id,
  _id: o._id || o.id
});

export const placementService = {
  getAllOffers: async (params = {}) => {
    try {
      const res = await api.get('/offers', { params });
      const items = (res.data || []).map(formatOffer);
      const pagination = res.pagination || {};

      return {
        offers: items,
        total: pagination.total !== undefined ? pagination.total : items.length,
        page: pagination.page || Number(params.page) || 1,
        totalPages: pagination.totalPages || Math.ceil((pagination.total || items.length) / (params.limit || 8)) || 1
      };
    } catch (err) {
      console.warn('[placementService] Fallback to local offers:', err.message);
      let result = [...initialOffers];
      if (params.search) {
        const q = params.search.toLowerCase();
        result = result.filter(
          (o) =>
            o.studentName?.toLowerCase().includes(q) ||
            o.companyName?.toLowerCase().includes(q) ||
            o.jobTitle?.toLowerCase().includes(q)
        );
      }
      return {
        offers: result.slice(0, Number(params.limit) || 8).map(formatOffer),
        total: result.length,
        page: Number(params.page) || 1,
        totalPages: Math.ceil(result.length / (Number(params.limit) || 8)) || 1
      };
    }
  },

  getOfferStats: async () => {
    try {
      const res = await api.get('/placements/stats');
      return res.data || res;
    } catch (err) {
      console.warn('[placementService] Fallback to computed stats:', err.message);
      const totalOffers = initialOffers.length;
      const acceptedOffers = initialOffers.filter((o) => o.status === 'Accepted').length;
      const acceptanceRate = totalOffers > 0 ? `${((acceptedOffers / totalOffers) * 100).toFixed(1)}%` : '0%';
      return {
        totalOffers,
        acceptedOffers,
        acceptanceRate,
        highestPackage: '52.0 LPA',
        averagePackage: '18.4 LPA'
      };
    }
  },

  getOfferById: async (id) => {
    try {
      const res = await api.get(`/offers/${id}`);
      return formatOffer(res.data || res);
    } catch (err) {
      const offer = initialOffers.find((o) => o.id === id || o.offerId === id || o._id === id);
      if (!offer) throw new Error('Offer letter record not found');
      return formatOffer(offer);
    }
  },

  createOffer: async (data) => {
    const res = await api.post('/offers', data);
    return formatOffer(res.data || res);
  },

  updateOfferStatus: async (id, updateData) => {
    const res = await api.put(`/offers/${id}`, updateData);
    return formatOffer(res.data || res);
  },

  deleteOffer: async (id) => {
    const res = await api.delete(`/offers/${id}`);
    return res.data || res;
  }
};

export default placementService;
