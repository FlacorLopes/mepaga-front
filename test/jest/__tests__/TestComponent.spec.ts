import { mount } from '@vue/test-utils';
import { describe, it, expect } from '@jest/globals';
import TestComponent from './demo/TestComponent.vue';
describe('TestComponent', () => {
  it('should contain h1', () => {
    const wrapper = mount(TestComponent);

    console.log(typeof wrapper.vm);

    expect(typeof wrapper.vm).toBe('object');
  });
});
