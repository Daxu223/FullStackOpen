const Course = ({ course }) => {
  return (
    <div>
      <Header name={course.name} />
      <Content parts={course.parts} />
      <Total parts={course.parts} />
    </div>
  )
}

// NOTE:
// This code is complaining about unsafe proptypes. 
// This can be fixed with this: https://legacy.reactjs.org/docs/typechecking-with-proptypes.html
// For the sake of the beginner exercise I won't fix. In production, absolutely.

// Is used by the course
const Header = ({ name }) => {
  return <h2>{name}</h2>
}

// Is used by the course
const Content = ({ parts }) => {
  return (
    <div>
      {parts.map((part) => (
        <Part key={part.id} name={part.name} exercises={part.exercises} />
      ))}
    </div>
  )
}

// Is used by the course
const Total = ({ parts }) => {
  const totalCount = parts.reduce((sum, part) => {
    return sum + part.exercises;
  }, 0)

  return <strong>total of {totalCount} exercises</strong>;
}

// Is used by content and total
const Part = ({ name, exercises }) => {
  return (
    <p>
      {name} {exercises}
    </p>
  )
}

export default Course
