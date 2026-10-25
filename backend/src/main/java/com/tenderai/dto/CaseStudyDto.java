package com.tenderai.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CaseStudyDto {
    private String id;
    private String title;
    private String client;
    private String budget;
    private String duration;
    private String summary;
    private List<String> technologies;
}
