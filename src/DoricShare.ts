import { Panel, Group, vlayout, layoutConfig, navigator, Gravity, navbar } from "doric";
import { title } from './utils'
// import { FeedListPanel } from './FeedList'
import { FlexLayoutDemo } from './FlexLayoutDemo'
import { TabDemoPanel } from './TabDemo'

@Entry
class DoricShare extends Panel {
    onShow() {
        navbar(context).setTitle("doric-share")
    }

    build(rootView: Group): void {
        vlayout([
            title('FeedList').apply({
                // onClick: () => {
                //     navigator(context).push(FeedListPanel)
                // }
            }),

            title('Tab').apply({
                onClick: () => {
                    navigator(context).push(TabDemoPanel)
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