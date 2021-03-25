import { Panel, Group, vlayout, layoutConfig, navigator, Gravity, navbar } from "doric";
import { title } from './utils'
import { FeedListDemo } from './FeedListDemo'
import { FlexLayoutDemo } from './FlexLayoutDemo'
import { TabDemo } from './TabDemo'

@Entry
class DoricShare extends Panel {
    onShow() {
        navbar(context).setTitle("Doric Share")
    }

    build(rootView: Group): void {
        vlayout([
            title('FeedList').apply({
                onClick: () => {
                    navigator(context).push(FeedListDemo)
                }
            }),

            title('Tab').apply({
                onClick: () => {
                    navigator(context).push(TabDemo)
                }
            }),

            title('Flex').apply({
                onClick: () => {
                    navigator(context).push(FlexLayoutDemo)
                }
            })
        ], {
            layoutConfig: layoutConfig().most(),
            gravity: Gravity.Center,
            space: 10
        }).in(rootView)
    }
}