import { Routes as ReactRoutes, Route } from 'react-router-dom'

import { Layout } from './components/layout'
import { HomePage } from './pages/home'
import { SummaryPage } from './pages/summary'
import { TopicPage } from './pages/topic'

export function Routes() {
  return (
    <ReactRoutes>
      <Route element={<Layout />}>
        <Route path="/">
          <Route index element={<HomePage />} />
          <Route path="summaries">
            <Route path=":id" element={<SummaryPage />} />
          </Route>
          <Route path="topics">
            <Route path=":topicSlug" element={<TopicPage />} />
          </Route>
        </Route>
        <Route path="*" element={<HomePage />} />
      </Route>
    </ReactRoutes>
  )
}
