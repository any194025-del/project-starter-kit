
-- updated_at helper
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- =========================
-- invitations
-- =========================
CREATE TABLE public.invitations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  template_id TEXT NOT NULL DEFAULT 'cinematic',
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','published','archived')),
  document JSONB NOT NULL,
  theme_overrides JSONB,
  owner_token TEXT,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_invitations_status ON public.invitations(status);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.invitations TO anon, authenticated;
GRANT ALL ON public.invitations TO service_role;

ALTER TABLE public.invitations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read published invitations"
  ON public.invitations FOR SELECT
  USING (status = 'published' OR true); -- prototype: all readable; tighten with auth later

CREATE POLICY "Anyone can create invitations (prototype)"
  ON public.invitations FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update invitations (prototype)"
  ON public.invitations FOR UPDATE
  USING (true) WITH CHECK (true);

CREATE POLICY "Anyone can delete invitations (prototype)"
  ON public.invitations FOR DELETE
  USING (true);

CREATE TRIGGER trg_invitations_updated_at
  BEFORE UPDATE ON public.invitations
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- =========================
-- invitation_drafts
-- =========================
CREATE TABLE public.invitation_drafts (
  invitation_id UUID NOT NULL PRIMARY KEY
    REFERENCES public.invitations(id) ON DELETE CASCADE,
  document JSONB NOT NULL,
  theme_overrides JSONB,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.invitation_drafts TO anon, authenticated;
GRANT ALL ON public.invitation_drafts TO service_role;

ALTER TABLE public.invitation_drafts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read drafts (prototype)"
  ON public.invitation_drafts FOR SELECT USING (true);
CREATE POLICY "Anyone can write drafts (prototype)"
  ON public.invitation_drafts FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update drafts (prototype)"
  ON public.invitation_drafts FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Anyone can delete drafts (prototype)"
  ON public.invitation_drafts FOR DELETE USING (true);

CREATE TRIGGER trg_invitation_drafts_updated_at
  BEFORE UPDATE ON public.invitation_drafts
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- =========================
-- guests
-- =========================
CREATE TABLE public.guests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  invitation_id UUID NOT NULL REFERENCES public.invitations(id) ON DELETE CASCADE,
  token TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  salutation TEXT,
  family TEXT,
  group_key TEXT,
  sa_parivar BOOLEAN NOT NULL DEFAULT false,
  max_guests INTEGER,
  greeting TEXT,
  honorific TEXT,
  note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_guests_invitation ON public.guests(invitation_id);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.guests TO anon, authenticated;
GRANT ALL ON public.guests TO service_role;

ALTER TABLE public.guests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read guests (prototype)"
  ON public.guests FOR SELECT USING (true);
CREATE POLICY "Anyone can write guests (prototype)"
  ON public.guests FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update guests (prototype)"
  ON public.guests FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Anyone can delete guests (prototype)"
  ON public.guests FOR DELETE USING (true);

CREATE TRIGGER trg_guests_updated_at
  BEFORE UPDATE ON public.guests
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- =========================
-- rsvps
-- =========================
CREATE TABLE public.rsvps (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  invitation_id UUID NOT NULL REFERENCES public.invitations(id) ON DELETE CASCADE,
  guest_id UUID NOT NULL REFERENCES public.guests(id) ON DELETE CASCADE,
  status TEXT NOT NULL CHECK (status IN ('pending','attending','maybe','declined')),
  guest_count INTEGER NOT NULL DEFAULT 1,
  message TEXT,
  responded_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (invitation_id, guest_id)
);
CREATE INDEX idx_rsvps_invitation ON public.rsvps(invitation_id);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.rsvps TO anon, authenticated;
GRANT ALL ON public.rsvps TO service_role;

ALTER TABLE public.rsvps ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read rsvps (prototype)"
  ON public.rsvps FOR SELECT USING (true);
CREATE POLICY "Anyone can write rsvps (prototype)"
  ON public.rsvps FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update rsvps (prototype)"
  ON public.rsvps FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Anyone can delete rsvps (prototype)"
  ON public.rsvps FOR DELETE USING (true);

CREATE TRIGGER trg_rsvps_updated_at
  BEFORE UPDATE ON public.rsvps
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
