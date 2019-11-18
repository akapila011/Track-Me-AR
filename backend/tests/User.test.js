function sum(a, b) {
    return a + b;
}

describe('User', () => {
    it('sum works', () => {
        expect(sum(1, 2)).toEqual(3);
    });
});