import Handlers from './Handlers.js';

describe('Handlers', function () {
    it('Should be defined', function () {
        expect(Handlers).toBeDefined();
    });
    let handlers;
    beforeEach(function () {
        handlers = new Handlers();
        let handler = {
            level: 200,
            handle: function () {
            }
        };
    });
    describe('Handlers initialization', function () {
        handlers.addHandler(handler);
        expect(handlers.getHandlers().length).toBe(1);
    });

    describe('Handlers removing', function () {
        handlers.addHandler(handler);
        handlers.removeHandler(handler);
        expect(handlers.getHandlers().length).toBe(1);
    });

    describe('Handlers record processing', function () {
        handlers.addHandler(handler);
        let handler2 = {
            level: 100,
            handle: function () {
            }
        };
        //TODO
        //spyOn()
    });
});
