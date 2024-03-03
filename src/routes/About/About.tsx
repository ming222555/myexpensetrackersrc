export default function About(): JSX.Element {
  return (
    <>
      <article className='About'>
        <section className='AboutSection bg-light px-3'>
          <h2 className='h6 py-3'>About</h2>
          <h5 className='h5 pt-5 text-info d-flex flex-column'>
            <span className='mb-1'>The following are used in this create-react-app webapp ...</span>
            <span style={{ fontSize: '0.8em', fontStyle: 'italic' }}>
              Inspiration for app comes from this
              <a
                href='https://ej2.syncfusion.com/showcase/typescript/expensetracker/?_gl=1*1cnpsto*_ga*NzY4MjEzNDg4LjE2MTg4ODEyMzE.*_ga_WC4JKKPHH0*MTYxODg4MTIzMC4xLjEuMTYxODg4MTQxNi4w#/expense'
                target='_blank'
                rel='noreferrer'
                className='ms-1'
              >
                site
              </a>
            </span>
          </h5>
          <hr />
          <span className='d-block text-info'>react v18</span>
          <span className='d-block text-info'>reduxjs/toolkit v2</span>
          <span className='d-block text-info'>react-redux v9</span>
          <span className='d-block text-info'>@tanstack/react-query v5</span>
          <span className='d-block text-info'>react-router-dom v6</span>

          <span className='d-block text-info mt-3'>es6</span>
          <span className='d-block text-info'>async code e.g. async/await, promise</span>
          <span className='d-block text-info mb-3'>typescript v4</span>

          <span className='d-block text-info'>useDebounce hook from npm rooks</span>
          <span className='d-block text-info'>sortBy from npm sort-by</span>
          <span className='d-block text-info'>matchSorter from npm match-sorter</span>
          <span className='d-block text-info mb-3'>indexdb wrapper from npm localforage</span>
          <span className='d-block text-info'>bootstrap v5</span>
          <span className='d-block text-info'>chart.js v4</span>
          <span className='d-block text-info'>chartjs-plugin-datalabels v2</span>
          <span className='d-block text-info'>react-bootstrap v2</span>
          <span className='d-block text-info'>react-chartjs-2 v5</span>
          <span className='d-block text-info'>react-datepicker v6</span>
          <span className='d-block text-info mb-3'>react-paginate v8</span>
          <span className='d-block text-info'>
            css, sass, bootstrap scss, BEM notation for css classes, css modules, responsive layouts
          </span>
        </section>
      </article>
    </>
  );
}
