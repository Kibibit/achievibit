var _ = require('lodash');

var doubleReview = {
	name: 'doubleReview',
	check: function(pullRequest, shall) {
		if (pullRequest.reviewers && pullRequest.reviewers.length === 2) {

			var achieve = {
				avatar : 'data:image/gif;base64,R0lGODlhLgAmANUAAJMAAHdMGFE+Pj4mAFpaWuTk5DQcAGhCDntkX////6aOhXd3d45oIS8vL6urq8fHx46Ojm0AAD4+PoBaHMedVWhoaCsYAExMTGRRTG0FAIoAALm5udoAAJ2dnaaAL4CAgKEAALmhmIo+GMemE//VQv//aOh3HL4AALlVGHtMGFEAAFU0BauFOVEFAEcrBf/otF85CTQAAPLHipNoJtWrZHJCE7mTR4paIaF3LwAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAAAAAAALAAAAAAuACYAAAb/wJZw2DK4YIHbDIdjOW1Q1kyJs9ForNRlAXkkHpBVSjkrz4hCIzK5bD6j01v1mt12E4XHYnU4jMtoRUcBbEtObyw4NylLVnUECw4JXxApYzeYN4FGfYVMh044Myk1ZE4pEpAdkwUOC6ZTmzCdmG1MUDaJMzWXZTUNWx0FrA4QBHI2Z0MGarRkMyxXNLiKlpe/WxVerA8Ox9NpgwEws0m1VjIy1ImkljUwK6mRw8OTxjI0Qi6lTDflSVVkvLBRoyA/FjcMHlgRjwCEBfUKSPSGTwiMGoRsKKJlQyDBdxf5JTwAjyEqCBUg4pF4L1+LFTVWuHAh5wiMG04K3hgxwuCU/xQLQ4qRwAUSPW84KrZwsYIZU5nkShUcQYJFDTOLFpZSYmkGpAUEILkKaEPIgKYiTIiokZQGjhcvZIgq48RtzKtMRFmyEXZBhbABwbWw4MLAChEoDggUSKMgjRs04MpAuBAZtVFQwkKJPA2HEAsDBsx0kVQgDn6Pa/TBZBXmDCtXNM6FIvDFtCuDRY9WZMUfpioJo2FJyJAt7Gmyq2ymkS7fAHJMR2O6iINC55GYQDK9Cjv58tpxLcCYELM4DNIwcDDHp3EXuYUyZ3KXjWs93PuiycMzWFB9uuadFQTPTPG5EMAtm92n4AuEFQRTEgGUEk1tNFAgSnYMyVdgAK+t9/9fOvcRBg8SNzAwAU7MxVVhXmUkJB9xDTSwT4ex3VJbBqANsBUDDNxghYoUWOcWDqTI5FoNEaQigQQFHdiPHOq9gGNopfBo4hUyBMmcWymo4OWLu0RAwAcOfECABDNFtZV6GWTw3AQTWOkGBYs9pkIEGsQIQgQqKHFDBNrk4UAHDZTgQgVo6oRDmzqeWCIDTVAQ12RdqqABAgoIcKcKV90AAggOPCDRAxccagya+9yQATkBwMnjHPhkcSefAiigAAIN2CrVChyQKVEBFUCQQAUXmMPEGkm8io4NXeKpgQYnIBBCCAjUqoBBCXHQ66AdOEAsQEy8YA6kt0xzg5eWClD/LQgKbKBADPDG4FoymGjLAbJzxGXDTXK8ce6sAqjrQLUIPIAAuiqsMEM65TaXjC3KPUcOJgire2sDCDiQqQAhaBrvCm5NgQ6I7EGDDg0APMeMAQJgEDCmISjQgAAbPKDpwfHGUMNHPoIoGT40mMwcACmTA4MBmFrs7swbCACv0x+nYENCPS94X9AsdER0yhIb0C6mG+AaAwLxBvzxEr4sfJ86mHQkihVbFw3DAF7PXO3TMXjZMrqMMLELd9OMYo1coqAcd9cGPN0AvF7GiwG8XbH4dyaYpLNEyHETPYA/A8DbwOMq5Dy2pozYolEmHnggmxkzBJ150Td0HsPneccbM/rdZeRVhSKpH7f65a8/F3viKmAQOuM5l55Xe98BCEXhr6fsD/HG25587reI7OGHNdIQBAA7',
				name : 'We\'re ready, master',
				short : _.escape('"This way!"-"No, that way!"'),
				description : 'double headed code review.<br>It doesn\'t matter who added you, apperantly, both of you are needed for a one man job 😇',
				relatedPullRequest: pullRequest.id
			};

			_.forEach(pullRequest.reviewers, function(reviewer) {
				shall.grant(reviewer.username, achieve);
			});
		}
	}
};

module.exports = doubleReview;