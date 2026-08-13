-- ============================================================
--  Solange's Hair Braiding — Seed Data
--  Run AFTER mysql-schema.sql
-- ============================================================

SET NAMES utf8mb4;

-- ---------------------------------------------------------------
--  Services (13 core services from the salon catalogue)
-- ---------------------------------------------------------------
INSERT INTO `services`
  (`slug`,`name`,`category`,`description`,`starting_price`,`duration`,`hair_included`,`is_featured`,`is_active`)
VALUES
(
  'knotless-braids','Knotless Braids','braids',
  'Our signature knotless braids are installed without knots at the base, giving a more natural look with less tension on your scalp. These braids are lightweight, flexible, and last 6-8 weeks with proper care.',
  180.00,'4-6 hours',0,1,1
),(
  'box-braids','Box Braids','braids',
  'Classic box braids divided into square sections. Versatile, protective style that can be worn in many ways. Available in various sizes from micro to jumbo.',
  150.00,'4-7 hours',0,1,1
),(
  'boho-braids','Boho Braids','braids',
  'Bohemian braids combine traditional braiding with flowing, wavy extensions for a romantic, free-spirited look. Perfect for special occasions or everyday wear.',
  200.00,'5-8 hours',0,1,1
),(
  'passion-twist','Passion Twist','twists',
  'Passion twists create a gorgeous, bohemian look with springy, coily twists that mimic natural locs. Low manipulation style that is gentle on natural hair.',
  190.00,'4-6 hours',0,1,1
),(
  'feed-in-braids','Feed-In Braids','cornrows',
  'Also known as Ghana braids, feed-in braids add extensions gradually for a natural-looking, seamless cornrow style. Less tension than traditional cornrows.',
  60.00,'2-3 hours',0,1,1
),(
  'stitch-braids','Stitch Braids','cornrows',
  'Stitch braids feature a unique stitching pattern that creates a distinctive, graphic look. Perfect for a bold, modern style statement.',
  80.00,'2-4 hours',0,0,1
),(
  'senegalese-twist','Senegalese Twist','twists',
  'Senegalese twists use silky Kanekalon hair for a sleek, smooth twist style. Lightweight and elegant, these twists can last up to 8 weeks.',
  180.00,'4-7 hours',0,1,1
),(
  'kids-braids','Kids Braids','kids',
  'Gentle, kid-friendly braiding services designed for young clients. We specialize in protective styles that are comfortable, cute, and age-appropriate.',
  45.00,'1-3 hours',0,1,1
),(
  'starter-locs','Starter Locs','locs',
  'Begin your loc journey with our professional starter locs service. We help you start your locs the right way for healthy, long-lasting results.',
  100.00,'2-4 hours',0,0,1
),(
  'loc-retwist','Loc Retwist','locs',
  'Keep your locs neat and maintained with our professional retwist service. We carefully palm roll or interlace to maintain clean parts and healthy loc growth.',
  80.00,'2-3 hours',0,0,1
),(
  'butterfly-locs','Butterfly Locs','locs',
  'Butterfly locs create a stunning, distressed loc look with wavy, looped ends. A beautiful combination of locs and waves for a truly unique protective style.',
  200.00,'5-8 hours',0,1,1
),(
  'frontal-install','Frontal Install','weaves',
  'Professional frontal and closure installation for a flawless, natural-looking weave. We ensure proper blending and a seamless hairline.',
  150.00,'3-4 hours',0,0,1
),(
  'fulani-braids','Fulani Braids','braids',
  'Fulani braids are a traditional West African style featuring cornrows and dangling braids, often adorned with beads and cowrie shells for a stunning cultural look.',
  180.00,'4-6 hours',0,0,1
);

-- ---------------------------------------------------------------
--  Reviews
-- ---------------------------------------------------------------
INSERT INTO `reviews`
  (`author_name`,`rating`,`review_text`,`source`,`is_featured`,`is_active`,`review_date`)
VALUES
(
  'Tiffany R.',5,
  'Solange is amazing! My braids are always neat, lightweight and last so long. The best braiding salon in Glen Burnie!',
  'google',1,1,CURDATE()
),(
  'Monique L.',5,
  'Professional, clean, and such a welcoming environment. I wouldn\'t go anywhere else!',
  'google',1,1,CURDATE()
),(
  'Danielle P.',5,
  'My daughter loves coming here for her box braids. Kid-friendly and always beautiful results!',
  'google',1,1,CURDATE()
),(
  'Jasmine W.',5,
  'I got the knotless braids and they lasted almost 2 months! Solange really knows her craft.',
  'google',0,1,CURDATE()
),(
  'Keisha M.',5,
  'Best salon experience I have had in Maryland. Very detailed and takes her time. Worth every penny.',
  'google',0,1,CURDATE()
),(
  'Aisha T.',5,
  'Came in for passion twists and left feeling like a queen. Will definitely be coming back!',
  'google',0,1,CURDATE()
);

-- ---------------------------------------------------------------
--  Images (24 photos du salon — sans catégorie)
--  Générées par scripts/import-salon-photos.mjs
-- ---------------------------------------------------------------
INSERT INTO `images`
  (`service_slug`,`title`,`source`,`source_id`,`original_url`,`cloudinary_url`,
   `cloudinary_public_id`,`width`,`height`,`alt_text`,`tags`,
   `photographer`,`photographer_url`,`is_featured`,`is_active`)
VALUES
(NULL,'Solange\'s Hair Braiding','owner',NULL,NULL,'/images/gallery/salon-01.jpg','salon-01',NULL,NULL,'Coiffure réalisée chez Solange\'s Hair Braiding','["salon"]',NULL,NULL,0,1),
(NULL,'Solange\'s Hair Braiding','owner',NULL,NULL,'/images/gallery/salon-02.jpg','salon-02',NULL,NULL,'Coiffure réalisée chez Solange\'s Hair Braiding','["salon"]',NULL,NULL,0,1),
(NULL,'Solange\'s Hair Braiding','owner',NULL,NULL,'/images/gallery/salon-03.jpg','salon-03',NULL,NULL,'Coiffure réalisée chez Solange\'s Hair Braiding','["salon"]',NULL,NULL,0,1),
(NULL,'Solange\'s Hair Braiding','owner',NULL,NULL,'/images/gallery/salon-04.jpg','salon-04',NULL,NULL,'Coiffure réalisée chez Solange\'s Hair Braiding','["salon"]',NULL,NULL,0,1),
(NULL,'Solange\'s Hair Braiding','owner',NULL,NULL,'/images/gallery/salon-05.jpg','salon-05',NULL,NULL,'Coiffure réalisée chez Solange\'s Hair Braiding','["salon"]',NULL,NULL,0,1),
(NULL,'Solange\'s Hair Braiding','owner',NULL,NULL,'/images/gallery/salon-06.jpg','salon-06',NULL,NULL,'Coiffure réalisée chez Solange\'s Hair Braiding','["salon"]',NULL,NULL,0,1),
(NULL,'Solange\'s Hair Braiding','owner',NULL,NULL,'/images/gallery/salon-07.jpg','salon-07',NULL,NULL,'Coiffure réalisée chez Solange\'s Hair Braiding','["salon"]',NULL,NULL,0,1),
(NULL,'Solange\'s Hair Braiding','owner',NULL,NULL,'/images/gallery/salon-08.jpg','salon-08',NULL,NULL,'Coiffure réalisée chez Solange\'s Hair Braiding','["salon"]',NULL,NULL,0,1),
(NULL,'Solange\'s Hair Braiding','owner',NULL,NULL,'/images/gallery/salon-09.jpg','salon-09',NULL,NULL,'Coiffure réalisée chez Solange\'s Hair Braiding','["salon"]',NULL,NULL,0,1),
(NULL,'Solange\'s Hair Braiding','owner',NULL,NULL,'/images/gallery/salon-10.jpg','salon-10',NULL,NULL,'Coiffure réalisée chez Solange\'s Hair Braiding','["salon"]',NULL,NULL,0,1),
(NULL,'Solange\'s Hair Braiding','owner',NULL,NULL,'/images/gallery/salon-11.jpg','salon-11',NULL,NULL,'Coiffure réalisée chez Solange\'s Hair Braiding','["salon"]',NULL,NULL,0,1),
(NULL,'Solange\'s Hair Braiding','owner',NULL,NULL,'/images/gallery/salon-12.jpg','salon-12',NULL,NULL,'Coiffure réalisée chez Solange\'s Hair Braiding','["salon"]',NULL,NULL,0,1),
(NULL,'Solange\'s Hair Braiding','owner',NULL,NULL,'/images/gallery/salon-13.jpg','salon-13',NULL,NULL,'Coiffure réalisée chez Solange\'s Hair Braiding','["salon"]',NULL,NULL,0,1),
(NULL,'Solange\'s Hair Braiding','owner',NULL,NULL,'/images/gallery/salon-14.jpg','salon-14',NULL,NULL,'Coiffure réalisée chez Solange\'s Hair Braiding','["salon"]',NULL,NULL,0,1),
(NULL,'Solange\'s Hair Braiding','owner',NULL,NULL,'/images/gallery/salon-15.jpg','salon-15',NULL,NULL,'Coiffure réalisée chez Solange\'s Hair Braiding','["salon"]',NULL,NULL,0,1),
(NULL,'Solange\'s Hair Braiding','owner',NULL,NULL,'/images/gallery/salon-16.jpg','salon-16',NULL,NULL,'Coiffure réalisée chez Solange\'s Hair Braiding','["salon"]',NULL,NULL,0,1),
(NULL,'Solange\'s Hair Braiding','owner',NULL,NULL,'/images/gallery/salon-17.jpg','salon-17',NULL,NULL,'Coiffure réalisée chez Solange\'s Hair Braiding','["salon"]',NULL,NULL,0,1),
(NULL,'Solange\'s Hair Braiding','owner',NULL,NULL,'/images/gallery/salon-18.jpg','salon-18',NULL,NULL,'Coiffure réalisée chez Solange\'s Hair Braiding','["salon"]',NULL,NULL,0,1),
(NULL,'Solange\'s Hair Braiding','owner',NULL,NULL,'/images/gallery/salon-19.jpg','salon-19',NULL,NULL,'Coiffure réalisée chez Solange\'s Hair Braiding','["salon"]',NULL,NULL,0,1),
(NULL,'Solange\'s Hair Braiding','owner',NULL,NULL,'/images/gallery/salon-20.jpg','salon-20',NULL,NULL,'Coiffure réalisée chez Solange\'s Hair Braiding','["salon"]',NULL,NULL,0,1),
(NULL,'Solange\'s Hair Braiding','owner',NULL,NULL,'/images/gallery/salon-21.jpg','salon-21',NULL,NULL,'Coiffure réalisée chez Solange\'s Hair Braiding','["salon"]',NULL,NULL,0,1),
(NULL,'Solange\'s Hair Braiding','owner',NULL,NULL,'/images/gallery/salon-22.jpg','salon-22',NULL,NULL,'Coiffure réalisée chez Solange\'s Hair Braiding','["salon"]',NULL,NULL,0,1),
(NULL,'Solange\'s Hair Braiding','owner',NULL,NULL,'/images/gallery/salon-23.jpg','salon-23',NULL,NULL,'Coiffure réalisée chez Solange\'s Hair Braiding','["salon"]',NULL,NULL,0,1),
(NULL,'Solange\'s Hair Braiding','owner',NULL,NULL,'/images/gallery/salon-24.jpg','salon-24',NULL,NULL,'Coiffure réalisée chez Solange\'s Hair Braiding','["salon"]',NULL,NULL,0,1);
