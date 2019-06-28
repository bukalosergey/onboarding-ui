export default {
    get: jest.fn().mockResolvedValue({ data: { isTeamLead: true } }),
    post: jest.fn().mockResolvedValue({ data: {} }),
    patch: jest.fn().mockResolvedValue({ data: {} })
};