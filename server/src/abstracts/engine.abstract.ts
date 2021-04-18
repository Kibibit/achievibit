export enum AchievibitEventNames {
  NewConnection = 'NewConnection',
  PullRequestOpened = 'PullRequestOpened',
  PullRequestInitialLabeled = 'PullRequestInitialLabeled',
  PullRequestLableAdded = 'PullRequestLableAdded',
  PullRequestLabelRemoved = 'PullRequestLabelRemoved',
  PullRequestEdited = 'PullRequestEdited',
  PullRequestAssigneeAdded = 'PullRequestAssigneeAdded',
  PullRequestAssigneeRemoved = 'PullRequestAssigneeRemoved',
  PullRequestReviewRequestAdded = 'PullRequestReviewRequestAdded',
  PullRequestReviewRequestRemoved = 'PullRequestReviewRequestRemoved',
  PullRequestReviewCommentAdded = 'PullRequestReviewCommentAdded',
  PullRequestReviewCommentRemoved = 'PullRequestReviewCommentRemoved',
  PullRequestReviewCommentEdited = 'PullRequestReviewCommentEdited',
  PullRequestReviewSubmitted = 'PullRequestReviewSubmitted',
  PullRequestMerged = 'PullRequestMerged'
}

export abstract class Engine<IEventPayload> {
  /**
   * ### [PING] NEW INTEGRATION
   * ##### [INIT]
   * a repo added achievibit as a GitHub webhook!
   * @param eventData the event payload
   */
  abstract handleNewConnection(eventData: IEventPayload): Promise<void>;

  /**
   * ### [PULL REQUEST] CREATED
   * ##### [INIT]
   * Get the data as it was when the pull request opened.
   * This will allow us to notify the achievements if something changed
   * in case some achievements want to deal with changing things.
   * notice that labels are given as a different event with the same
   * time, so that way we know if that was an added label at creation
   * or later
   * @param eventData the event payload
   */
  abstract handlePullRequestOpened(eventData: IEventPayload): Promise<void>;

  /**
   * ### [PULL REQUEST] LABELS
   * ##### [INIT]
   * This event means a label was added on creation.
   * Therefore, we'll add that to the pull request without
   * adding an update event
   * @param eventData the event payload
   */
  abstract handlePullRequestInitialLabeled(
    eventData: IEventPayload
  ): Promise<void>;

  /**
   * ### [PULL REQUEST] LABEL ADDED
   * ##### [UPDATE]
   * @param eventData the event payload
   */
  abstract handlePullRequestLabelAdded(eventData: IEventPayload): Promise<void>;

  /**
   * ### [PULL REQUEST] LABEL REMOVED
   * ##### [UPDATE]
   * @param eventData the event payload
   */
  abstract handlePullRequestLabelRemoved(
    eventData: IEventPayload
  ): Promise<void>;

  /**
   * ### [PULL REQUEST] EDITED
   * ##### [UPDATE]
   * This means something changed:
   *  * title
   *  * description
   * @param eventData the event payload
   */
  abstract handlePullRequestEdited(eventData: IEventPayload): Promise<void>;

  /**
   * ### [PULL REQUEST] ASSIGNEES ADDED
   * ##### [UPDATE]
   * Currently, we don't log this change. But we can do that if we'll
   * have some ideas for achievemenets for that :-)
   * @param eventData the event payload
   */
  abstract handlePullRequestAssigneeAdded(
    eventData: IEventPayload
  ): Promise<void>;

  /**
   * ### [PULL REQUEST] ASSIGNEES REMOVED
   * ##### [UPDATE]
   * Currently, we don't log this change. But we can do that if we'll
   * have some ideas for achievemenets for that :-)
   * @param eventData the event payload
   */
  abstract handlePullRequestAssigneeRemoved(
    eventData: IEventPayload
  ): Promise<void>;

  /* *********** */
  /* CODE REVIEW */
  /* *********** */

  /**
   * [PULL REQUEST] REVIEW REQUEST ADDED
   * ##### [UPDATE]
   * A new review requested from another user by the pull request creator
   * @param eventData the event payload
   */
  abstract handlePullRequestReviewRequestAdded(
    eventData: IEventPayload
  ): Promise<void>;

  /**
   * [PULL REQUEST] REVIEW REQUEST REMOVED
   * ##### [UPDATE]
   * A review request was removed by the pull request creator
   * @param eventData the event payload
   */
  abstract handlePullRequestReviewRequestRemoved(
    eventData: IEventPayload
  ): Promise<void>;

  /* **************************** */
  /* PULL REQUEST REVIEW COMMENTS */
  /* **************************** */

  /**
   * ### [REVIEW COMMENT] ADDED
   * ##### [UPDATE]
   * A new comment was added
   * @param eventData the event payload
   */
  abstract handlePullRequestReviewCommentAdded(
    eventData: IEventPayload
  ): Promise<void>;

  /**
   * ### [REVIEW COMMENT] REMOVED
   * ##### [UPDATE]
   * A comment was removed
   * @param eventData the event payload
   */
  abstract handlePullRequestReviewCommentRemoved(
    eventData: IEventPayload
  ): Promise<void>;

  /**
   * ### [REVIEW COMMENT] EDITED
   * ##### [UPDATE]
   * A comment was edited
   * @param eventData the event payload
   */
  abstract handlePullRequestReviewCommentEdited(
    eventData: IEventPayload
  ): Promise<void>;

  /**
   * ### [REVIEW] REVIEW SUBMITTED
   * ##### [UPDATE]
   * A code reviewer submitted his code review (need changed, etc.)
   * @param eventData the event payload
   */
  abstract handlePullRequestReviewSubmitted(
    eventData: IEventPayload
  ): Promise<void>;

  /**
   * ### [PULL REQUEST] MERGED
   * ##### [UPDATE + DELETE]
   * Send correct events based on data
   * so achievements can listen and UNLOCK if
   * data matched what they looked for
   * @param eventData the event payload
   */
  abstract handlePullRequestMerged(eventData: IEventPayload): Promise<void>;
}
