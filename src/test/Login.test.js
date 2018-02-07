import React from 'react';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import Login from '../Login';

configure({ adapter: new Adapter() });

describe('Login component should have', () => {
  const wrapper = shallow(<Login />);
  it('a wrapper for FB login button', () => {
    expect(wrapper.find('.login-wrapper-fb').length).toBe(1);
  });
});
