import initialOffers from '../data/offers.json';

let offersList = [...initialOffers];

export const placementService = {
  getAllOffers: async (params = {}) => {
    await new Promise((resolve) => setTimeout(resolve, 60));
    let result = [...offersList];

    if (params.search) {
      const q = params.search.toLowerCase();
      result = result.filter(
        (o) =>
          o.studentName.toLowerCase().includes(q) ||
          o.companyName.toLowerCase().includes(q) ||
          o.jobTitle.toLowerCase().includes(q) ||
          (o.offerId && o.offerId.toLowerCase().includes(q))
      );
    }
    if (params.status && params.status !== 'All') {
      result = result.filter((o) => o.status === params.status);
    }
    if (params.department && params.department !== 'All') {
      result = result.filter((o) => o.studentDepartment === params.department);
    }
    if (params.company && params.company !== 'All') {
      result = result.filter((o) => o.companyName === params.company);
    }

    const total = result.length;
    const page = Number(params.page) || 1;
    const limit = Number(params.limit) || 8;
    const start = (page - 1) * limit;
    const paginated = result.slice(start, start + limit);

    return {
      offers: paginated,
      total,
      page,
      totalPages: Math.ceil(total / limit) || 1
    };
  },

  getOfferStats: async () => {
    await new Promise((resolve) => setTimeout(resolve, 40));
    const totalOffers = offersList.length;
    const acceptedOffers = offersList.filter((o) => o.status === 'Accepted').length;
    const acceptanceRate = totalOffers > 0 ? `${((acceptedOffers / totalOffers) * 100).toFixed(1)}%` : '0%';

    // Parse numeric CTCs
    const packages = offersList
      .map((o) => parseFloat(o.ctc))
      .filter((n) => !isNaN(n));

    const highestNum = packages.length > 0 ? Math.max(...packages) : 0;
    const avgNum = packages.length > 0 ? (packages.reduce((a, b) => a + b, 0) / packages.length).toFixed(1) : '0.0';

    return {
      totalOffers,
      acceptedOffers,
      acceptanceRate,
      highestPackage: `${highestNum.toFixed(1)} LPA`,
      averagePackage: `${avgNum} LPA`
    };
  },

  getOfferById: async (id) => {
    await new Promise((resolve) => setTimeout(resolve, 60));
    const offer = offersList.find((o) => o.id === id || o.offerId === id);
    if (!offer) throw new Error('Offer letter record not found');
    return offer;
  },

  createOffer: async (data) => {
    await new Promise((resolve) => setTimeout(resolve, 80));
    const newOffer = {
      ...data,
      id: `off-${Date.now()}`,
      offerId: `OFF${new Date().getFullYear()}-${String(offersList.length + 1).padStart(3, '0')}`,
      status: data.status || 'Offered',
      offerDate: data.offerDate || new Date().toISOString().slice(0, 10),
      createdAt: new Date().toISOString()
    };
    offersList.unshift(newOffer);
    return newOffer;
  },

  updateOfferStatus: async (id, updateData) => {
    await new Promise((resolve) => setTimeout(resolve, 80));
    const index = offersList.findIndex((o) => o.id === id || o.offerId === id);
    if (index === -1) throw new Error('Offer record not found');

    const updated = {
      ...offersList[index],
      ...updateData,
      updatedAt: new Date().toISOString()
    };
    offersList[index] = updated;
    return updated;
  },

  deleteOffer: async (id) => {
    await new Promise((resolve) => setTimeout(resolve, 80));
    offersList = offersList.filter((o) => o.id !== id && o.offerId !== id);
    return { success: true };
  }
};
