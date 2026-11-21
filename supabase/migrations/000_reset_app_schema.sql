-- ============================================================
-- Clear a failed JuwaLoot schema run.
-- Run this once, then run supabase/schema.sql again.
-- Does not delete auth.users.
-- ============================================================

drop table if exists public.conversation_unread_reminders cascade;
drop table if exists public.conversation_inbox_labels cascade;
drop table if exists public.inbox_label_definitions cascade;
drop table if exists public.inbox_canned_replies cascade;
drop table if exists public.notifications cascade;
drop table if exists public.signup_phone_attempts cascade;
drop table if exists public.deleted_users_audit cascade;
drop table if exists public.moderation_suspension_events cascade;
drop table if exists public.messages cascade;
drop table if exists public.reactions cascade;
drop table if exists public.comments cascade;
drop table if exists public.announcements cascade;
drop table if exists public.conversations cascade;
drop table if exists public.follows cascade;
drop table if exists public.admin_reports cascade;
drop table if exists public.otp_tokens cascade;
drop table if exists public.profiles cascade;
drop table if exists public.businesses cascade;

drop type if exists public.reaction_type cascade;
drop type if exists public.admin_report_status cascade;
drop type if exists public.user_role cascade;
drop type if exists public.business_role cascade;
drop type if exists public.account_status cascade;

drop function if exists public.set_updated_at() cascade;
drop function if exists public.my_profile() cascade;
drop function if exists public.is_business_admin(uuid) cascade;
drop function if exists public.is_business_member(uuid) cascade;
drop function if exists public.is_approved_user() cascade;
drop function if exists public.is_business_user() cascade;
drop function if exists public.promote_user_to_business_admin(text, text) cascade;
drop function if exists public.touch_conversation_on_message() cascade;
drop function if exists public.notify_staff_on_customer_message() cascade;
drop function if exists public.notify_customer_on_staff_reply() cascade;
drop function if exists public.messages_validate_reply_to() cascade;
drop function if exists public.comments_validate_parent() cascade;
drop function if exists public.conversation_inbox_labels_same_business() cascade;
drop function if exists public.seed_inbox_preset_labels_for_business() cascade;
drop function if exists public.relay_auth_user_id_for_email(text) cascade;
drop function if exists public.mark_customer_messages_read_for_staff(uuid) cascade;
drop function if exists public.mark_staff_messages_read_for_customer(uuid) cascade;
drop function if exists public.mark_messages_read_by_ids(uuid[]) cascade;
drop function if exists public.ensure_conversation_unread_reminder(uuid, text) cascade;
drop function if exists public.cancel_conversation_unread_reminder_if_clear(uuid) cascade;
drop function if exists public.inbox_latest_previews(uuid[]) cascade;
drop function if exists public.inbox_unread_customer_counts(uuid[]) cascade;
drop function if exists public.staff_post_engagement_counts(uuid, uuid[]) cascade;
drop function if exists public.staff_post_reaction_rows(uuid, uuid[]) cascade;
drop function if exists public.staff_post_comment_rows(uuid, uuid[]) cascade;
drop function if exists public.notify_approved_customers_of_announcement(uuid) cascade;
