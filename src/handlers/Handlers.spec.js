import Handlers from './Handlers.js';

describe('Handlers', () => {
    it('Should be defined', () => {
        expect(Handlers).toBeDefined();
    });
    let handlers;
    let handler;
    beforeEach(() => {
        handlers = new Handlers();
        handler = {
            level: 200,
            handle: () => {
            }
        };
    });
    it('Should support handlers initialization', () => {
        handlers.addHandler(handler);
        expect(handlers.getHandlers().length).toBe(1);
    });

    it('Should allow handlers removing', () => {
        handlers.addHandler(handler);
        handlers.removeHandler(handler);
        expect(handlers.getHandlers().length).toBe(0);
    });

    it('Should process records correctly', () => {
        handlers.addHandler(handler);
        let handler2 = {
            level: 100,
            handle: () => {
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
