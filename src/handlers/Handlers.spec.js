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
        handlers.add(handler);
        expect(handlers.getAll().length).toBe(1);
    });

    it('Should allow handlers removing', () => {
        handlers.add(handler);
        handlers.remove(handler);
        expect(handlers.getAll().length).toBe(0);
    });

    it('Should process records correctly', () => {
        handlers.add(handler);
        let handler2 = {
            level: 100,
            handle: () => {
            }
        };
        handlers.add(handler2);
        spyOn(handler, 'handle');
        spyOn(handler2, 'handle');
        handlers.handle({level: 150, message: 'test'});
        expect(handler2.handle).toHaveBeenCalled();
        expect(handler.handle).not.toHaveBeenCalled();
    });
});
