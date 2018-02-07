import React from 'react';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import Login from '../Login';

configure({ adapter: new Adapter() });

describe('Login component should have', () => {
  const boolWrapper = true;
  const wrapper = shallow(<Login isLoggedIn={boolWrapper} />);
  it('a wrapper for all login buttons', () => {
    expect(wrapper.find('.login-wrapper').length).toBe(1);
  });
  it('a wrapper for FB login button', () => {
    expect(wrapper.find('.login-wrapper-fb').length).toBe(1);
  });
});
