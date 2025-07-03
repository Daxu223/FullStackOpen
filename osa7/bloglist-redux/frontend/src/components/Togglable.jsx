import { useState, useImperativeHandle, forwardRef } from 'react'
import PropTypes from 'prop-types'

const Togglable = forwardRef((props, ref) => {
  const [visible, setVisible] = useState(false)

  // Hides component, when visibility set to true
  const hideChildComponent = {
    display: visible ? 'none' : '',
  }
  // Shows component, when visibility set to true
  const showChildComponent = {
    display: visible ? '' : 'none',
  }
  // Uses the state to toggle it off, if on, and the other way around
  const toggleVisibility = () => setVisible(!visible)

  useImperativeHandle(ref, () => {
    return {
      toggleVisibility,
    }
  })

  return (
    <div>
      <div style={hideChildComponent}>
        <button onClick={toggleVisibility}>{props.buttonLabel}</button>
      </div>

      <div style={showChildComponent}>
        {props.children}
        <button onClick={toggleVisibility}>Cancel</button>
      </div>
    </div>
  )
})

Togglable.propTypes = {
  buttonLabel: PropTypes.string.isRequired,
}

Togglable.displayName = 'Togglable'

export default Togglable
