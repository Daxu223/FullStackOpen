import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

const blog = {
  author: 'Daxu223',
  title: 'Component testing is done with react-testing-library',
  url: 'http://localhost:5173',
  likes: 0,
  user: { username: 'tester', name: 'tester' }
}

// Test to render blog title, more details would be shown when toggled
// In this test only the Blog component is tested
test('renders blog title', () => {
  const { container } = render(<Blog blog={blog} />)
  
  const div = container.querySelector('.blog')

  expect(div).toHaveTextContent(
    'Component testing is done with react-testing-library'
  )
})

test('url, likes and user is shown with a button click', async () => {
  const { container } = render(<Blog blog={blog} />)

  const user = userEvent.setup()
  const showButton = screen.getByText('view')
  await user.click(showButton)
 
  // screen.debug()

  expect(container).toHaveTextContent('http://localhost:5173')
  expect(container).toHaveTextContent('likes 0')
  expect(container).toHaveTextContent('tester')
})

test('like button is pressed twice via function handler', async () => {
    const likeMock = vi.fn()
    
    // This is the initial blog, without any details shown
    render(
        <Blog blog={blog} onLike={likeMock} />
    )

    // User presses 'view' button
    const user = userEvent.setup()
    const showButton = screen.getByText('view')
    await user.click(showButton)
    
    // screen.debug()

    // Get the like button from the details and click it two times
    const button = screen.getByText('like')
    await user.click(button)
    await user.click(button)

    expect(likeMock.mock.calls).toHaveLength(2)
})