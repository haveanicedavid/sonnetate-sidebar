import { Routes as ReactRoutes, Route } from 'react-router-dom'

import { AppLayout } from './components/layout/app-layout'
import { FeedPage } from './pages/feed'
import { HomePage } from './pages/home'
import { SummaryPage } from './pages/summary'
import { TopicPage } from './pages/topic'

export function Routes() {
  return (
    <ReactRoutes>
      <Route element={<AppLayout />}>
        <Route path="/">
          <Route index element={<HomePage />} />
          <Route path="summaries">
            <Route path=":id" element={<SummaryPage />} />
          </Route>
          <Route path="topics">
            <Route path=":topicSlug" element={<TopicPage />} />
          </Route>
          <Route path="feed" element={<FeedPage />} />
        </Route>
        <Route path="*" element={<HomePage />} />
      </Route>
    </ReactRoutes>
  )
}
