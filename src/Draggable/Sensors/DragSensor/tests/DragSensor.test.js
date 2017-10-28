import {
  createSandbox
} from 'helper';

import DragSensor from './..';
import Draggable from './..';

const sampleMarkup = `
  <ul>
    <li>First item<span></span></li>
    <li>Second item</li>
  </ul>
`;

describe('DragSensor', () => {

  describe('#constructor', () => {
    test('should initialize dragging state to false', () => {
      const dragSensor = new DragSensor();

      expect(dragSensor.dragging).toBe(false);
    });

    test('should initialize the current container to null', () => {
      const dragSensor = new DragSensor();

      expect(dragSensor.currentContainer).toBe(null);
    });
  });

  describe('#attach', () => {
    test('should add event listeners to each container', () => {
      const containers = [{}, {}, {}];

      // Mock addEventListener for each container
      containers.forEach((container) => {
        container.addEventListener = jest.fn();
      });

      const dragSensor = new DragSensor(containers);

      // Before calling attach, no events should have been added
      containers.forEach((container) => {
        expect(container.addEventListener.mock.calls.length).toBe(0);
      });

      dragSensor.attach();

      // After calling attach, 5 events should have been added
      containers.forEach((container) => {
        expect(container.addEventListener.mock.calls.length).toBe(5);
      });

      // And the events should be correct
      containers.forEach((container) => {
        expect(container.addEventListener.mock.calls[0])
          .toMatchObject(['mousedown', dragSensor._onMouseDown, true]);

        expect(container.addEventListener.mock.calls[1])
          .toMatchObject(['dragstart', dragSensor._onDragStart, false]);

        expect(container.addEventListener.mock.calls[2])
          .toMatchObject(['dragover', dragSensor._onDragOver, false]);

        expect(container.addEventListener.mock.calls[3])
          .toMatchObject(['dragend', dragSensor._onDragEnd, false]);

        expect(container.addEventListener.mock.calls[4])
          .toMatchObject(['drop', dragSensor._onDragDrop, false]);
      });
    });

    test('should add mouseup event listener to document', (done) => {
      const dragSensor = new DragSensor();

      document.addEventListener = jest.fn();

      dragSensor.attach();

      expect(document.addEventListener.mock.calls.length).toBe(1);

      document.addEventListener.mockRestore();

      done();
    });
  });

  describe('#_onMouseUp', () => {
    test('should clear mousedown timeout on mouseup', (done) => {
      const dragSensor = new DragSensor();
      const mouseUpEvent = new MouseEvent('mouseup');
      
      // I do not know of a deterministic way to check whether a timeout has
      // been cleared, so we must mock the global function.
      window.clearTimeout = jest.fn();

      dragSensor.attach();

      document.dispatchEvent(mouseUpEvent);

      expect(window.clearTimeout.mock.calls.length).toBe(1);

      window.clearTimeout.mockRestore();

      done();
    });
  });
  
});