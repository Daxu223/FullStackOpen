import { render, screen } from '@testing-library/react'
import BlogForm from './BlogForm'
import userEvent from '@testing-library/user-event'

test('BlogForm can be updated with data and calls onSubmit correctly', async () => {
  const user = userEvent.setup()
  const createBlog = vi.fn()

  render(<BlogForm createBlog={createBlog} />)

  const titleInput = screen.getByPlaceholderText('title')
  const authorInput = screen.getByPlaceholderText('author')
  const urlInput = screen.getByPlaceholderText('url')
  const submitButton = screen.getByText('Create')

  await user.type(titleInput, 'The title is something')
  await user.type(authorInput, 'And it was made by someone')
  await user.type(urlInput, 'And it exists in this url')
  await user.click(submitButton)

  expect(createBlog.mock.calls).toHaveLength(1)
  expect(createBlog.mock.calls[0][0].title).toBe('The title is something')
  expect(createBlog.mock.calls[0][0].author).toBe('And it was made by someone')
  expect(createBlog.mock.calls[0][0].url).toBe('And it exists in this url')
})