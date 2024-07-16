import { Routes as ReactRoutes, Route } from 'react-router-dom'

import { AppLayout } from './components/layout/app-layout'
import { HomePage } from './pages/home'
import { SettingsPage } from './pages/settings'
import { SitePage } from './pages/site'
import { SitesPage } from './pages/sites'
import { SummariesPage } from './pages/summaries'
import { SummaryPage } from './pages/summary'
import { TopicsPage } from './pages/topics'
import { TreePage } from './pages/tree'

export function Routes() {
  return (
    <ReactRoutes>
      <Route element={<AppLayout />}>
        <Route path="/">
          <Route index element={<HomePage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="topics" element={<TopicsPage />} />
          <Route path="sites">
            <Route index element={<SitesPage />} />
            <Route path=":id" element={<SitePage />} />
          </Route>
          <Route path="summaries">
            <Route index element={<SummariesPage />} />
            <Route path=":id" element={<SummaryPage />} />
          </Route>
          <Route path="trees">
            <Route path=":treeSlug" element={<TreePage />} />
          </Route>
        </Route>
        <Route path="*" element={<HomePage />} />
      </Route>
    </ReactRoutes>
  )
}
