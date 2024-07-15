import { Routes as ReactRoutes, Route } from 'react-router-dom'

import { AppLayout } from './components/layout/app-layout'
import { HomePage } from './pages/home'
import { SettingsPage } from './pages/settings'
import { SummariesPage } from './pages/summaries'
import { SummaryPage } from './pages/summary'
import { TopicPage } from './pages/topic'
import { TopicsPage } from './pages/topics'

export function Routes() {
  return (
    <ReactRoutes>
      <Route element={<AppLayout />}>
        <Route path="/">
          <Route index element={<HomePage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="summaries">
            <Route index element={<SummariesPage />} />
            <Route path=":id" element={<SummaryPage />} />
          </Route>
          <Route path="topics">
            <Route index element={<TopicsPage />} />
            <Route path=":topicSlug" element={<TopicPage />} />
          </Route>
        </Route>
        <Route path="*" element={<HomePage />} />
      </Route>
    </ReactRoutes>
  )
}
