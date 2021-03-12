import { Panel, Group, vlayout, layoutConfig, log, HLayout, View, LayoutSpec, Gravity, text, Text, Color, Refreshable, navbar, ViewModel, ViewHolder, VMPanel, refreshable, list, listItem, ListItem, List, hlayout, flexlayout, image, ScaleType, stack, Align, FlowLayout, flowlayout, flowItem, Image, FlowLayoutItem, Stack, coordinator, VLayout } from "doric";
import Timeline from './timeline.json'
import { rotatedArrow, sudukouMarginLeft, sudukouMarginRight, feedMargin, sudukouGap, sudukouReuseIdentifier } from './utils'


type DisplayImageInfo = {
    imageW: number
    imageH: number
    scaleType: ScaleType
}

interface TimelineImageInfo {
    imageUrl: string,
    imgHeight: number,
    imgWidth: number
}

interface TimelineModel {
    code: string,
    msg: string,
    result: Array<{
        age: number,
        avatar: string,
        avatarFrame?: string,
        gender: number,
        imageList?: Array<TimelineImageInfo>,
        nickname: string,
        textContent?: string,
    }>
}

class FeedListModel {
    pageIndex: number
    timeline: TimelineModel
    darkModel: Boolean

    constructor(timeline: TimelineModel, darkModel: Boolean, pageIndex = 0) {
        this.timeline = timeline
        this.pageIndex = pageIndex
        this.darkModel = darkModel
    }

    // 模拟没有更多数据
    get isEnd() {
        return this.pageIndex >= 5
    }
}

class FeedListView extends ViewHolder {
    refreshView!: Refreshable
    // loadMoreTextView!: Text
    listView!: List

    sudukouWidth = Environment.screenWidth - sudukouMarginLeft - sudukouMarginRight - feedMargin
    // 以三张图片占满屏幕
    baseImageWidth = (this.sudukouWidth - 2 * sudukouGap) / 3.0
    // 以两张图片占满屏幕
    baseImageWidthFor2And4 = (this.sudukouWidth - sudukouGap) / 2.0

    build(root: Group) {
        vlayout([
            refreshable({
                // header: rotatedArrow(),
                content: list({
                    // loadMore: true,
                    // loadMoreView: listItem(
                    //     text({
                    //         text: '加载中....',
                    //         textColor: Color.parse("#999999"),
                    //         textSize: 12,
                    //         backgroundColor: Color.WHITE,
                    //         layoutConfig: layoutConfig().most().configHeight(LayoutSpec.JUST).configAlignment(Gravity.Center),
                    //         height: 40,
                    //     }).also(it => this.loadMoreTextView = it)
                    // ),
                    

                    itemCount: 0,
                    renderItem: () => new ListItem,
                    layoutConfig: layoutConfig().most()
                }).also(it => this.listView = it)
            }).also(it => this.refreshView = it)
        ]).apply({
            layoutConfig: layoutConfig().most()
        }).in(root)
    }

    getImageDisplayInfo(imageInfo: TimelineImageInfo, count: number): DisplayImageInfo {
        const scale = imageInfo.imgWidth * 1.0 / imageInfo.imgHeight
        let imageW = 0
        let imageH = 0
        let scaleType = ScaleType.ScaleAspectFill
        if (count === 1) {
            if (scale <= 3 / 4.0) {
                imageW = 2 * this.baseImageWidth + sudukouGap
                imageH = imageW / (3 / 4.0)
                scaleType = ScaleType.ScaleAspectFill
            } else if (scale < 1) {
                imageW = 2 * this.baseImageWidth + sudukouGap
                imageH = imageW / scale
                scaleType = ScaleType.ScaleAspectFit
            } else if (scale === 1) {
                imageW = 2 * this.baseImageWidth + sudukouGap
                imageH = imageW
                scaleType = ScaleType.ScaleAspectFit
            } else if (scale < 16 / 9.0) {
                imageH = 1.7 * this.baseImageWidth + sudukouGap
                imageW = scale * imageH
                scaleType = ScaleType.ScaleAspectFit
            } else if (scale <= 2) {
                imageW = this.sudukouWidth
                imageH = imageW / scale
                scaleType = ScaleType.ScaleAspectFit
            } else {
                imageH = 1.5 * this.baseImageWidth + sudukouGap
                imageW = this.sudukouWidth
                scaleType = ScaleType.ScaleAspectFill
            }
        } else if (count === 2 || count === 4) {
            imageW = this.baseImageWidthFor2And4
            imageH = imageW
            scaleType = ScaleType.ScaleAspectFill
        } else {
            imageW = this.baseImageWidth
            imageH = this.baseImageWidth
            scaleType = ScaleType.ScaleAspectFill
        }
        return {
            imageH,
            imageW,
            scaleType
        }
    }
      
    getImageSudokuFlowLayout(config: Partial<HLayout>, imageList: Array<TimelineImageInfo>): HLayout {
        const count = imageList.length
        let flHeight = 0
        let flWidth = this.sudukouWidth
        if (count === 1) {
            const displayInfo = this.getImageDisplayInfo(imageList[0], count)
            flHeight = displayInfo.imageH
            flWidth = displayInfo.imageW
        } else if (count === 2) {
            flHeight = this.baseImageWidthFor2And4
        } else if (count === 4) {
            flHeight = this.baseImageWidthFor2And4 * 2 + sudukouGap
        } else {
            let rows = Math.floor((count + 2) / 3)
            flHeight = rows * this.baseImageWidth + (rows - 1) * sudukouGap
        }

        let columnCount = 0
        if (count === 1) {
            columnCount = 1
        } else if (count === 2 || count === 4) {
            columnCount = 2
        } else {
            columnCount = 3
        }

        const elements = new Array<Array<Image>>()
        for (let index = 0; index < columnCount; index++) {
            elements.push(Array<Image>())
        }

        imageList.forEach((val, index) => {
            const displayInfo = this.getImageDisplayInfo(val, count)
            let element = elements[index % columnCount];
            element.push(
                image({
                    imageUrl: imageList[index].imageUrl,
                    layoutConfig: layoutConfig().just(),
                    width: displayInfo.imageW,
                    height: displayInfo.imageH,
                    scaleType: displayInfo.scaleType,
                })
            )
        })

        let children: VLayout[] = []
        elements.forEach(ele => {
            children.push(
                vlayout(ele, {
                    space: count === 1 ? 0 : sudukouGap
                })
            )
        })

        const sudukou = hlayout(children, config)
        sudukou.height = flHeight
        sudukou.width = flWidth
        sudukou.space = count === 1 ? 0 : sudukouGap

        return sudukou        
    }

    bind(s: FeedListModel) {
        this.refreshView.setRefreshing(context, false)
        // this.loadMoreTextView.text = s.isEnd ? '没有更多了~' : '加载中...'

        if (!s.isEnd) {
            this.listView.also(it => {
                it.itemCount = s.timeline.result.length
                it.renderItem = (index) => listItem(
                    vlayout([
                        hlayout([
                            stack([
                                image({
                                    imageUrl: s.timeline.result[index].avatar || '',
                                    layoutConfig: layoutConfig().just(),
                                    width: 40,
                                    height: 40,
                                    scaleType: ScaleType.ScaleAspectFit,
                                    corners: 20,
                                    top: 12,
                                    left: 12
                                }),
                                image({
                                    imageUrl: s.timeline.result[index].avatarFrame || '',
                                    layoutConfig: layoutConfig().just(),
                                    width: 64,
                                    height: 64,
                                    scaleType: ScaleType.ScaleAspectFit
                                })
                            ], {
                                layoutConfig: layoutConfig().most().configWidth(LayoutSpec.JUST),
                                width: 64
                            }),
                            text({
                                text: s.timeline.result[index].nickname || '',
                                textColor: Color.parse("#111111"),
                                textSize: 16
                            }),
                            text({
                                text: s.timeline.result[index].age.toString(),
                                layoutConfig: layoutConfig().just(),
                                left: 10,
                                width: 30,
                                height: 14,
                                textSize: 10,
                                corners: 7,
                                backgroundColor: s.timeline.result[index].gender === 1 ? Color.parse("#EEEEEE") : Color.parse('#FFEDF2'),
                                textColor: s.timeline.result[index].gender === 1 ? Color.parse("#999999") : Color.parse('#FF6E94'),
                            })
                        ], {
                            layoutConfig: layoutConfig().most().configHeight(LayoutSpec.JUST),
                            height: 64,
                            gravity: Gravity.CenterY
                        }),

                        hlayout([
                            text({
                                text: s.timeline.result[index].textContent || '',
                                textColor: Color.parse("#111111"),
                                textSize: 16,
                                maxLines: 0,
                                textAlignment: Gravity.Left,
                                padding: {
                                    bottom: 10
                                },
                            }),
                        ], {
                            layoutConfig: layoutConfig().configWidth(LayoutSpec.MOST).configHeight(LayoutSpec.FIT),
                            left: sudukouMarginLeft
                        }),

                        (s.timeline.result[index].imageList || []).length > 0 ? this.getImageSudokuFlowLayout({
                            layoutConfig: layoutConfig().just(),
                            left: sudukouMarginLeft,
                            corners: 16,
                        }, s.timeline.result[index].imageList!) : text({})
                    ], {
                        layoutConfig: layoutConfig().most().configHeight(LayoutSpec.FIT),
                        padding: {
                            left: feedMargin,
                            right: sudukouMarginRight,
                            top: feedMargin,
                            bottom: feedMargin
                        }
                    })
                , {
                    layoutConfig: layoutConfig().most().configHeight(LayoutSpec.FIT),
                })
            })
        }
    }
}

class FeedListVM extends ViewModel<FeedListModel, FeedListView> {
    onAttached(s: FeedListModel, vh: FeedListView) {
        log('saadadawd')
        log('saadadawd')
    }

    onBind(s: FeedListModel, vh: FeedListView) {
        vh.bind(s)
    }
}

@Entry
class FeedListPanel extends VMPanel<FeedListModel, FeedListView> {
    getViewHolderClass() {
        return FeedListView
    }

    getViewModelClass() {
        return FeedListVM
    }

    getState(): FeedListModel {
        return new FeedListModel(Timeline, false)
    }

    onShow() {
        navbar(context).setTitle("feed-list")
    }
}