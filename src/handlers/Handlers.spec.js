import Handlers from './Handlers.js';

describe('Handlers', function () {
    it('Should be defined', function () {
        expect(Handlers).toBeDefined();
    });
    let handlers;
    let handler;
    beforeEach(function () {
        handlers = new Handlers();
        handler = {
            level: 200,
            handle: function () {
            }
        };
    });
    it('Should support handlers initialization', function () {
        handlers.addHandler(handler);
        expect(handlers.getHandlers().length).toBe(1);
    });

    it('Should allow handlers removing', function () {
        handlers.addHandler(handler);
        handlers.removeHandler(handler);
        expect(handlers.getHandlers().length).toBe(0);
    });

    it('Should process records correctly', function () {
        handlers.addHandler(handler);
        let handler2 = {
            level: 100,
            handle: function () {
            }
        };
        handlers.addHandler(handler2);
        spyOn(handler, 'handle');
        spyOn(handler2, 'handle');
        handlers.handle({level: 150, message: 'test'});
        expect(handler2.handle).toHaveBeenCalled();
        expect(handler.handle).not.toHaveBeenCalled();
    });
});
