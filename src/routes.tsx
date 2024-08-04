import { Routes as ReactRoutes, Route } from 'react-router-dom'

import { AppLayout } from './components/layout/app-layout'
import { HomePage } from './pages/home'
import { JournalPage } from './pages/journal'
import { SettingsPage } from './pages/settings'
import { SitePage } from './pages/site'
import { SitesPage } from './pages/sites'
import { SummariesPage } from './pages/summaries'
import { SummaryPage } from './pages/summary'
import { TopicPage } from './pages/topic'
import { TopicsPage } from './pages/topics'

export function Routes() {
  return (
    <ReactRoutes>
      <Route element={<AppLayout />}>
        {/* <Route path="/" element={<HomePage />} /> */}
        <Route path="/" element={<JournalPage />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="topics">
          <Route index element={<TopicsPage />} />
          <Route path="*" element={<TopicPage />} />
        </Route>
        <Route path="sites">
          <Route index element={<SitesPage />} />
          <Route path=":id" element={<SitePage />} />
        </Route>
        <Route path="summaries">
          <Route index element={<SummariesPage />} />
          <Route path=":id" element={<SummaryPage />} />
        </Route>
        <Route path="*" element={<HomePage />} />
      </Route>
    </ReactRoutes>
  )
}
