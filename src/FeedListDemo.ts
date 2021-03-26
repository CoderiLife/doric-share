import { Panel, Group, vlayout, layoutConfig, popover, log, HLayout, pullable, View, LayoutSpec, Gravity, text, Text, Color, Refreshable, navbar, ViewModel, ViewHolder, VMPanel, refreshable, list, listItem, ListItem, List, hlayout, flexlayout, image, ScaleType, stack, Align, FlowLayout, flowlayout, flowItem, Image, FlowLayoutItem, Stack, coordinator, VLayout, navigator } from "doric";
import { isThisTypeNode } from "typescript";
import Timeline from './timeline.json'
import {PhotoBrowserDemo} from './PhotoBrowserDemo'
import { icon_refresh, sudukouMarginLeft, sudukouMarginRight, feedMargin, sudukouGap, sudukouReuseIdentifier } from './utils'


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
        isExpanded?: boolean
    }>
}

class FeedListModel {
    timeline: TimelineModel
    darkModel: Boolean
    end: Boolean

    constructor(timeline: TimelineModel, darkModel: Boolean, end: Boolean) {
        this.timeline = timeline
        this.darkModel = darkModel
        this.timeline.result.map(info => info.isExpanded = false)
        this.end = end
    }
}

class FeedListView extends ViewHolder {
    refreshView!: Refreshable
    loadMoreTextView!: Text
    listView!: List
    rightTextView!: Text

    sudukouWidth = Environment.screenWidth - sudukouMarginLeft - sudukouMarginRight - feedMargin
    // 以三张图片占满屏幕
    baseImageWidth = (this.sudukouWidth - 2 * sudukouGap) / 3.0
    // 以两张图片占满屏幕
    baseImageWidthFor2And4 = (this.sudukouWidth - sudukouGap) / 2.0

    build(root: Group) {

        navbar(context).setRight(text({
            text: "黑夜"
        }).also(it => this.rightTextView = it))

        vlayout([
            refreshable({
                header: this.rotatedArrow(),
                content: list({
                    loadMore: true,
                    loadMoreView: listItem(
                        text({
                            text: '加载中....',
                            textColor: Color.parse("#999999"),
                            textSize: 12,
                            backgroundColor: Color.WHITE,
                            layoutConfig: layoutConfig().most().configAlignment(Gravity.Center),
                            height: 40,
                        }).also(it => this.loadMoreTextView = it),
                        {
                            backgroundColor: Color.WHITE,
                            layoutConfig: layoutConfig().most().configHeight(LayoutSpec.JUST).configAlignment(Gravity.Center),
                            height: 40,
                        }
                    ),
                    layoutConfig: layoutConfig().most()
                }).also(it => this.listView = it)
            }).also(it => this.refreshView = it)
        ]).apply({
            layoutConfig: layoutConfig().most()
        }).in(root)
    }

    rotatedArrow() {
        let refreshImage: Image
        return pullable(
            stack([
                image({
                    layoutConfig: layoutConfig().just().configMargin({ top: 50, bottom: 10, }),
                    width: 30,
                    height: 30,
                    imageBase64: icon_refresh,
                }).also(v => refreshImage = v),
            ]), {
            startAnimation: () => {
                log('startAnimation')
            },
            stopAnimation: () => {
                log('stopAnimation')
            },
            setPullingDistance: (distance: number) => {
                refreshImage.rotation = distance / 30
            },
        })
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
        if (count === 0) {
            return vlayout([], {})
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

                    onClick: () => {
                        navigator(context).push(PhotoBrowserDemo, {
                            animated: true,
                            extra: {
                                current: index,
                                source: imageList
                            }
                        })
                    }
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
        sudukou.space = count === 1 ? 0 : sudukouGap

        return sudukou        
    }

    switchDarkMode = (isDark: Boolean) => {
        this.rightTextView.text = isDark ? "白天" : "黑夜"
        this.rightTextView.textColor = isDark ? Color.WHITE : Color.BLACK
        this.listView.backgroundColor = isDark ? Color.BLACK : Color.WHITE
        navbar(context).setBgColor(isDark ? Color.BLACK : Color.WHITE)
    } 

    bind(s: FeedListModel) {
        this.refreshView.setRefreshing(context, false)
        this.loadMoreTextView.text = s.end ? '没有更多了~' : '加载中...'

        // 白天黑夜模式
        this.switchDarkMode(s.darkModel)
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
                            textColor: s.darkModel ? Color.WHITE : Color.parse("#111111"),
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

                    vlayout([
                        text({
                            text: s.timeline.result[index].textContent || '',
                            textColor: s.darkModel ? Color.WHITE : Color.parse("#111111"),
                            textSize: 16,
                            maxLines: s.timeline.result[index].isExpanded ? 0 : 3,
                            textAlignment: Gravity.Left,
                            backgroundColor: Color.BLUE,
                            padding: {
                                bottom: 10
                            },
                        }),

                        // mock
                        (s.timeline.result[index].textContent || '').length >= 80 ? text({
                            text: s.timeline.result[index].isExpanded ? '收起' : '展开',
                            textSize: 14,
                            textAlignment: Gravity.Left,
                            textColor: Color.parse('#8854FF'),
                            padding: {
                                bottom: 10
                            },
                            onClick: () => {
                                s.timeline.result[index].isExpanded = !s.timeline.result[index].isExpanded
                                this.bind(s)
                            }
                        }) : text({
                            text: '',
                            padding: {
                                bottom: 0
                            },
                        })
                    ], {
                        backgroundColor: Color.GREEN,
                        layoutConfig: layoutConfig().configWidth(LayoutSpec.MOST).configHeight(LayoutSpec.FIT),
                        left: sudukouMarginLeft
                    }),

                    this.getImageSudokuFlowLayout({
                        left: sudukouMarginLeft,
                        corners: 16,
                    }, s.timeline.result[index].imageList || [])
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

class FeedListVM extends ViewModel<FeedListModel, FeedListView> {
    // 模拟分页，设定总共3页
    private pageIndex = 1

    onAttached(s: FeedListModel, vh: FeedListView) {
        vh.rightTextView.onClick = () => {
            this.updateState((state) => {
                state.darkModel = !state.darkModel
            })
        }

        vh.refreshView.onRefresh = () => {
            setTimeout(() => {
                vh.refreshView.setRefreshing(context, false) 
                this.pageIndex = 1
                const model = new FeedListModel(Timeline, s.darkModel, false)
                this.updateState((state) => {
                    state.darkModel = model.darkModel
                    state.end = model.end
                    state.timeline.result = model.timeline.result
                })
            }, 1000)
        }

        vh.listView.onLoadMore = () => {
            if (this.pageIndex === 1) {
                this.pageIndex++;
                this.updateState((state) => {
                    state.end = false
                    state.timeline.result = s.timeline.result
                })
            } else {
                if (this.pageIndex <= 3) {
                    this.pageIndex++;
                    const newTimeLine: TimelineModel = Timeline
                    const deepCopyTimeline: TimelineModel = JSON.parse(JSON.stringify(newTimeLine))
                    deepCopyTimeline.result.map(info => info.isExpanded = false)
                    let result = s.timeline.result.concat(deepCopyTimeline.result)

                    this.updateState((state) => {
                        state.end = (this.pageIndex === 3)
                        state.timeline.result = result
                    })
                }
            }
        }
    }

    onBind(s: FeedListModel, vh: FeedListView) {
        vh.bind(s)
    }
}

@Entry
export class FeedListDemo extends VMPanel<FeedListModel, FeedListView> {
    getViewHolderClass() {
        return FeedListView
    }

    getViewModelClass() {
        return FeedListVM
    }

    getState(): FeedListModel {
        return new FeedListModel(Timeline, false, false)
    }

    onShow() {
        
    }

    onCreate() {
        navbar(context).setTitle("Feed List")
    }
}